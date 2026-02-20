import Link from "next/link";
import type { Metadata } from "next";
import { getAllCheatsheets } from "@/lib/cheatsheets";

export const metadata: Metadata = {
  title: "Cheatsheets | ChSON",
  description: "Browse example cheatsheets in ChSON format.",
};

export default function CheatsheetsPage() {
  const all = getAllCheatsheets().sort((a, b) => {
    const ap = a.product.localeCompare(b.product);
    if (ap !== 0) return ap;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <h1 className="font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.03em]">
        Cheatsheets
      </h1>
      <p className="mt-3 text-zinc-600">
        Source of truth lives in <code className="font-mono">cheatsheets/**</code> as{" "}
        <code className="font-mono">.chson.json</code>.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((s) => (
          <Link
            key={`${s.product}/${s.name}`}
            className="grid min-h-[120px] gap-2 rounded-2xl border border-black/10 bg-white/70 p-4 shadow-soft hover:border-black/20 hover:no-underline"
            href={`/cheatsheets/${s.product}/${s.name}`}
          >
            <div className="grid gap-0.5">
              <div className="font-semibold">{s.data.title}</div>
              <div className="text-xs text-zinc-600">
                {s.product}/{s.name}
              </div>
            </div>
            <div className="text-sm text-zinc-600">{s.data.description}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
