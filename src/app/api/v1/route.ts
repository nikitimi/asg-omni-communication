import { TITLE } from "@/utils/constants";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: `Welcome to ${TITLE} v1.0 API.` });
}
