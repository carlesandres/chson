import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import 'app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://chson.dev'),
  title: 'ChSON',
  description:
    'A JSON format for writing software cheatsheets. Write once, render anywhere.',
  robots: {
    index: false,
    follow: false,
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          defer
          data-domain="chson.dev"
          src="https://plausible.io/js/script.tagged-events.js"
        ></script>
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          {/* Background gradient effect */}
          <div
            aria-hidden="true"
            className="bg-gradient-ambient pointer-events-none fixed -inset-[var(--spacing-bleed)] -z-10 blur-2xl"
          />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
