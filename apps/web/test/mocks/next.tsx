import React from 'react';
import { vi } from 'vitest';

export const pushMock = vi.fn();
export const pathnameMock = vi.fn(() => '/');

vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: pushMock,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    };
  },
  usePathname() {
    return pathnameMock();
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
