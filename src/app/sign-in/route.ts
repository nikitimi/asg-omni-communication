import { NextResponse } from "next/server";
import googleOAuth2 from "@/utils/googleOAuth2";
import { SCOPES } from "@/utils/constants";

/** Temporary redirect. */
export async function GET() {
  const redirectURL = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL ?? "";
  const oAuth2Client = googleOAuth2(redirectURL);

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES.split(" "),
  });

  console.log(oAuth2Client);
  return NextResponse.redirect(url);
}
