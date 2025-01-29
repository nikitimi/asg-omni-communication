import googleOAuth2 from "@/utils/googleOAuth2";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const redirectUrl = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL ?? "";
  const oauth2Client = googleOAuth2(redirectUrl);
  const cookieList = await cookies();

  try {
    const cookieCred = cookieList.get(process.env.CREDENTIALS_COOKIE_KEY!);
    if (!cookieCred) {
      throw new Error("Invalid credential cookie.");
    }
    const credentials = JSON.parse(cookieCred.value);
    oauth2Client.setCredentials(credentials);

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    return NextResponse.json({
      success: true,
      message: res.data,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: (err as Error).message,
      },
      { status: 400 }
    );
  }
}
