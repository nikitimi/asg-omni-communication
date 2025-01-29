import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log(await req.json());
  console.log(req.body);

  return NextResponse.json({
    success: true,
    message: "Webhook API called.",
  });
}
