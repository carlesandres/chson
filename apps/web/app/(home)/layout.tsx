import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from 'lib/layout.shared';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="mx-auto w-full max-w-[var(--fd-layout-width)] px-4 py-8">
        {children}
      </div>
    </HomeLayout>
  );
}
