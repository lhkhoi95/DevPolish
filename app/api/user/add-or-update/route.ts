import { addOrUpdateUser } from "@/mongodb/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    const res = await addOrUpdateUser(userData);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { message: "Failed to add user" },
      { status: 500 }
    );
  }
}
