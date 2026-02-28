import type { Metadata } from 'next';
import 'app/globals.css';
import { Header, Footer } from 'components/chson';
import { QueryProvider } from 'providers/query-provider';
import { ThemeProvider } from 'providers/theme-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://chson.dev'),
  title: 'ChSON',
  description:
    'A JSON format for writing software cheatsheets. Write once, render anywhere.',
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
      <body className="min-h-screen">
        <ThemeProvider>
          <QueryProvider>
            {/* Background gradient effect */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-[-20vh] -z-10 blur-2xl [background:radial-gradient(900px_500px_at_20%_10%,rgba(11,91,211,0.18),transparent_60%),radial-gradient(800px_520px_at_85%_15%,rgba(216,75,42,0.16),transparent_62%),radial-gradient(900px_700px_at_50%_85%,rgba(0,0,0,0.05),transparent_65%)] dark:opacity-50"
            />

            <div className="mx-auto px-4 pb-14 pt-7">
              <Header />
              <main className="max-w-4xl mx-auto animate-fade-up px-2 pt-9">
                {children}
              </main>
              <Footer />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
