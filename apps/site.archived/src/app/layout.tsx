import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChSON",
  description: "A JSON format for writing software cheatsheets. Write once, render anywhere.",
};

function Header() {
  return (
    <header className="animate-slide-in rounded-2xl border border-black/10 bg-white/70 px-3 py-2 shadow-soft backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link
          className="rounded-xl px-2 py-2 font-display text-base font-semibold tracking-[-0.02em]"
          href="/"
        >
          ChSON
        </Link>
        <nav className="flex flex-wrap justify-end gap-2">
          <Link
            className="rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-black/5 hover:text-zinc-900 hover:no-underline"
            href="/"
          >
            Home
          </Link>
          <Link
            className="rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-black/5 hover:text-zinc-900 hover:no-underline"
            href="/docs"
          >
            Docs
          </Link>
          <Link
            className="rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-black/5 hover:text-zinc-900 hover:no-underline"
            href="/cheatsheets"
          >
            Cheatsheets
          </Link>
          <a
            className="rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-black/5 hover:text-zinc-900 hover:no-underline"
            href="https://github.com/carlesandres/chson"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 px-2 py-5 text-sm text-zinc-600">
      <span>ChSON is a JSON format for cheatsheets.</span>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Background gradient effect */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-[-20vh] -z-10 blur-2xl [background:radial-gradient(900px_500px_at_20%_10%,rgba(11,91,211,0.18),transparent_60%),radial-gradient(800px_520px_at_85%_15%,rgba(216,75,42,0.16),transparent_62%),radial-gradient(900px_700px_at_50%_85%,rgba(0,0,0,0.05),transparent_65%)]"
        />

        <div className="mx-auto max-w-5xl px-4 pb-14 pt-7">
          <Header />
          <main className="animate-fade-up px-2 pt-9">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
