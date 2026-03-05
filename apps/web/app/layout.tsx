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
            className="pointer-events-none fixed inset-[-20vh] -z-10 blur-2xl [background:radial-gradient(900px_500px_at_20%_10%,rgba(11,91,211,0.18),transparent_60%),radial-gradient(800px_520px_at_85%_15%,rgba(216,75,42,0.16),transparent_62%),radial-gradient(900px_700px_at_50%_85%,rgba(0,0,0,0.05),transparent_65%)] dark:opacity-50"
          />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
