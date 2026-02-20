import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from 'utils/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

// Query keys
export const authKeys = {
  session: ['auth', 'session'] as const,
  user: ['auth', 'user'] as const,
};

// Fetch current session
async function fetchSession(): Promise<Session | null> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  return session;
}

// Fetch current user
async function fetchUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
}

// Sign in with email/password
interface SignInCredentials {
  email: string;
  password: string;
}

async function signIn({
  email,
  password,
}: SignInCredentials): Promise<Session> {
  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;
  if (!session) throw new Error('No session returned');
  return session;
}

// Sign up with email/password
interface SignUpCredentials {
  email: string;
  password: string;
}

async function signUp({
  email,
  password,
}: SignUpCredentials): Promise<Session> {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  if (!session) throw new Error('No session returned');
  return session;
}

// Sign out
async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Hooks

/**
 * Query hook to get current session
 */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Query hook to get current user
 */
export function useUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Mutation hook to sign in
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: (session) => {
      // Update session and user cache
      queryClient.setQueryData(authKeys.session, session);
      queryClient.setQueryData(authKeys.user, session.user);
    },
  });
}

/**
 * Mutation hook to sign up
 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (session) => {
      // Update session and user cache
      queryClient.setQueryData(authKeys.session, session);
      queryClient.setQueryData(authKeys.user, session.user);
    },
  });
}

/**
 * Mutation hook to sign out
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.setQueryData(authKeys.session, null);
      queryClient.setQueryData(authKeys.user, null);
      // Optionally clear all cached data on sign out
      queryClient.clear();
    },
  });
}
