import { createClerkClient } from "@clerk/backend";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  const userLists = await clerkClient.users.getUserList();

  return NextResponse.json({
    success: true,
    message: userLists,
  });
}
