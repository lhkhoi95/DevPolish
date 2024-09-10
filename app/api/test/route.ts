import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("PDF2TEXT API called");
  return NextResponse.json({ message: "Hello, Next.js!" });
}
