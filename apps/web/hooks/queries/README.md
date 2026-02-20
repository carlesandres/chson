# TanStack Query Hooks

This directory contains React Query hooks for data fetching and mutations.

## Structure

- `use-posts.ts` - Example hooks for managing posts data
- `use-auth.ts` - Hooks for authentication (session, sign in/up/out)

## Usage Examples

### Fetching Data

```tsx
import { usePosts } from 'hooks/queries/use-posts';

function PostsList() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Creating Data

```tsx
import { useCreatePost } from 'hooks/queries/use-posts';

function CreatePostForm() {
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost.mutateAsync({
        title: 'New Post',
        content: 'Post content',
      });
      alert('Post created!');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

### Updating Data with Optimistic Updates

```tsx
import { useUpdatePost } from 'hooks/queries/use-posts';

function EditPost({ postId }: { postId: string }) {
  const updatePost = useUpdatePost();

  const handleUpdate = () => {
    updatePost.mutate({
      id: postId,
      title: 'Updated Title',
    });
  };

  return <button onClick={handleUpdate}>Update Post</button>;
}
```

### Authentication

```tsx
import { useSession, useSignIn, useSignOut } from 'hooks/queries/use-auth';

function AuthComponent() {
  const { data: session } = useSession();
  const signIn = useSignIn();
  const signOut = useSignOut();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.email}</p>
        <button onClick={() => signOut.mutate()}>Sign Out</button>
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        signIn.mutate({
          email: 'user@example.com',
          password: 'password',
        })
      }
    >
      Sign In
    </button>
  );
}
```

## Query Key Patterns

Each hook file exports query key factories to ensure consistency:

```tsx
// posts
postsKeys.all; // ['posts']
postsKeys.lists(); // ['posts', 'list']
postsKeys.detail(id); // ['posts', 'detail', id]

// auth
authKeys.session; // ['auth', 'session']
authKeys.user; // ['auth', 'user']
```

## Best Practices

1. **Use query keys** - Always use the exported key factories for consistency
2. **Handle loading states** - Check `isLoading` and `isPending` for better UX
3. **Handle errors** - Always handle error states in your components
4. **Optimistic updates** - Use for better perceived performance
5. **Invalidate queries** - After mutations, invalidate related queries
6. **Enable conditionally** - Use `enabled` option to control when queries run

## Creating New Query Hooks

When creating new hooks, follow this pattern:

1. Define query keys factory
2. Define TypeScript types
3. Create async functions for API calls
4. Create query hooks using `useQuery`
5. Create mutation hooks using `useMutation`
6. Add proper error handling and cache invalidation

See `use-posts.ts` for a complete example.
