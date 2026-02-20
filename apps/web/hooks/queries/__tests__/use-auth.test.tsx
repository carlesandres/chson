import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useSession,
  useUser,
  useSignIn,
  useSignUp,
  useSignOut,
  authKeys,
} from '../use-auth';
import { supabase } from 'utils/supabaseClient';
import React from 'react';
import type { Mock } from 'vitest';

// Mock Supabase client
vi.mock('utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

const authGetSessionMock = supabase.auth.getSession as unknown as Mock;
const authGetUserMock = supabase.auth.getUser as unknown as Mock;
const authSignInWithPasswordMock = supabase.auth
  .signInWithPassword as unknown as Mock;
const authSignUpMock = supabase.auth.signUp as unknown as Mock;
const authSignOutMock = supabase.auth.signOut as unknown as Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('authKeys', () => {
  it('should generate correct query keys', () => {
    expect(authKeys.session).toEqual(['auth', 'session']);
    expect(authKeys.user).toEqual(['auth', 'user']);
  });
});

describe('useSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch session successfully', async () => {
    const mockSession = {
      access_token: 'token',
      user: { id: '1', email: 'test@example.com' },
    };

    authGetSessionMock.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSession);
    expect(supabase.auth.getSession).toHaveBeenCalled();
  });

  it('should handle null session', async () => {
    authGetSessionMock.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });

  it('should handle session fetch error', async () => {
    const mockError = new Error('Session error');

    authGetSessionMock.mockResolvedValue({
      data: { session: null },
      error: mockError,
    });

    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch user successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };

    authGetUserMock.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUser);
    expect(supabase.auth.getUser).toHaveBeenCalled();
  });

  it('should handle null user', async () => {
    authGetUserMock.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });
});

describe('useSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign in successfully', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const mockSession = {
      access_token: 'token',
      user: { id: '1', email: credentials.email },
    };

    authSignInWithPasswordMock.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useSignIn(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(credentials);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(credentials);
    expect(result.current.data).toEqual(mockSession);
  });

  it('should handle sign in error', async () => {
    const credentials = { email: 'test@example.com', password: 'wrong' };
    const mockError = new Error('Invalid credentials');

    authSignInWithPasswordMock.mockResolvedValue({
      data: { session: null },
      error: mockError,
    });

    const { result } = renderHook(() => useSignIn(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(credentials);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should throw error when no session returned', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };

    authSignInWithPasswordMock.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useSignIn(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(credentials);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect((result.current.error as Error).message).toBe('No session returned');
  });
});

describe('useSignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign up successfully', async () => {
    const credentials = { email: 'new@example.com', password: 'password123' };
    const mockSession = {
      access_token: 'token',
      user: { id: '1', email: credentials.email },
    };

    authSignUpMock.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useSignUp(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(credentials);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(supabase.auth.signUp).toHaveBeenCalledWith(credentials);
    expect(result.current.data).toEqual(mockSession);
  });

  it('should handle sign up error', async () => {
    const credentials = { email: 'existing@example.com', password: 'password' };
    const mockError = new Error('Email already exists');

    authSignUpMock.mockResolvedValue({
      data: { session: null },
      error: mockError,
    });

    const { result } = renderHook(() => useSignUp(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(credentials);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

describe('useSignOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign out successfully', async () => {
    authSignOutMock.mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useSignOut(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle sign out error', async () => {
    const mockError = new Error('Sign out failed');

    authSignOutMock.mockResolvedValue({
      error: mockError,
    });

    const { result } = renderHook(() => useSignOut(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
