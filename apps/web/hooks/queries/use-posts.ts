import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from 'utils/supabaseClient';

// Query keys
export const postsKeys = {
  all: ['posts'] as const,
  lists: () => [...postsKeys.all, 'list'] as const,
  list: (filters?: string) => [...postsKeys.lists(), filters] as const,
  details: () => [...postsKeys.all, 'detail'] as const,
  detail: (id: string) => [...postsKeys.details(), id] as const,
};

// Type definitions (adjust based on your Supabase schema)
export interface Post {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreatePostData {
  title: string;
  content?: string;
}

export interface UpdatePostData {
  id: string;
  title?: string;
  content?: string;
}

// Fetch all posts
async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Fetch single post
async function fetchPost(id: string): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Create post
async function createPost(postData: CreatePostData): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert([postData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update post
async function updatePost({ id, ...updates }: UpdatePostData): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete post
async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) throw error;
}

// Hooks

/**
 * Query hook to fetch all posts
 */
export function usePosts() {
  return useQuery({
    queryKey: postsKeys.lists(),
    queryFn: fetchPosts,
  });
}

/**
 * Query hook to fetch a single post by ID
 */
export function usePost(id: string) {
  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: () => fetchPost(id),
    enabled: !!id, // Only run if id is provided
  });
}

/**
 * Mutation hook to create a new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    },
  });
}

/**
 * Mutation hook to update a post with optimistic updates
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onMutate: async (updatedPost) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: postsKeys.detail(updatedPost.id),
      });

      // Snapshot previous value
      const previousPost = queryClient.getQueryData<Post>(
        postsKeys.detail(updatedPost.id),
      );

      // Optimistically update
      if (previousPost) {
        queryClient.setQueryData<Post>(postsKeys.detail(updatedPost.id), {
          ...previousPost,
          ...updatedPost,
        });
      }

      return { previousPost };
    },
    onError: (err, updatedPost, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(
          postsKeys.detail(updatedPost.id),
          context.previousPost,
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch after error or success
      queryClient.invalidateQueries({
        queryKey: postsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    },
  });
}

/**
 * Mutation hook to delete a post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, deletedId) => {
      // Remove from cache and refetch list
      queryClient.removeQueries({ queryKey: postsKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    },
  });
}
