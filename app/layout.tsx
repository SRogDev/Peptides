import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peptides — A Platinum Scientific Exploration Experience",
  description:
    "Explore curated peptides, their sequences and properties, one real 3D molecular structure, live scientific literature and a grounded research assistant. Not a medical or drug-design tool.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#fafafa] text-neutral-900">
        <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight">Peptides</span>
              <span className="hidden text-[11px] uppercase tracking-[0.18em] text-neutral-400 sm:inline">
                Platinum · Scientific exploration
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/" className="min-h-[44px] rounded-full px-3 py-2.5 text-neutral-700 hover:bg-neutral-100">Explorer</Link>
              <Link href="/compare" className="min-h-[44px] rounded-full px-3 py-2.5 text-neutral-700 hover:bg-neutral-100">Compare</Link>
              <Link href="/methodology" className="min-h-[44px] rounded-full px-3 py-2.5 text-neutral-700 hover:bg-neutral-100">Methodology</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-neutral-500 sm:px-6">
            Peptides is a scientific exploration demo, not a medical application, peptide generator or
            drug-design platform. Missing data is shown as missing. Calculated values are labelled as
            calculations; measured values cite PubChem, RCSB PDB or Europe PMC.
          </div>
        </footer>
      </body>
    </html>
  );
}
