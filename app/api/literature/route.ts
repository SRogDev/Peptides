import { NextResponse } from "next/server";
import { searchLiterature } from "@/lib/europepmc";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });
  try {
    const articles = await searchLiterature(q, 8);
    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({ error: "Europe PMC unavailable" }, { status: 502 });
  }
}
