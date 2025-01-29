import googleOAuth2 from "@/utils/googleOAuth2";
import googleOAuth2CallbackSchema from "@/utils/schemas/googleOAuth2Callback";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

/** Auth code. */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirectUrl = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL ?? "";
  const oauth2Client = googleOAuth2(redirectUrl);

  const { success, ...rest } = googleOAuth2CallbackSchema.safeParse(
    Object.fromEntries(url.searchParams.entries())
  );

  if (!success) {
    return NextResponse.json(
      {
        success,
        message: `Parsing searchparams error: ${rest.error!.message}.`,
      },
      { status: 400 }
    );
  }

  try {
    const { tokens } = await oauth2Client.getToken(rest.data!.code);
    const expirationDate = tokens.expiry_date;
    if (typeof expirationDate !== "number") {
      throw new Error("Expiration date is invalid.");
    }
    const cookieList = await cookies();
    cookieList.set(
      ...[process.env.CREDENTIALS_COOKIE_KEY ?? "", JSON.stringify(tokens)],
      {
        expires: expirationDate,
        path: "/api/v1/google/",
        secure: process.env.NODE_ENV === "production",
      }
    );
  } catch (err) {
    console.log(oauth2Client);
    console.log((err as Error).message);
  }
  return NextResponse.redirect("http://localhost:3000/");
}
