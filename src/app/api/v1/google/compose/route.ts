import getRedirectURL from "@/utils/getRedirectURL";
import googleOAuth2 from "@/utils/googleOAuth2";
import mailComposeSchema, {
  type MailCompose,
} from "@/utils/schemas/mailCompose";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const redirectUrl = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL ?? "";
  const oAuth2Client = googleOAuth2(redirectUrl);
  const cookieList = await cookies();
  const json = await req.json();

  const { success, ...rest } = mailComposeSchema.safeParse(json);

  try {
    if (!success) {
      throw new Error(rest.error!.message);
    }
    const cookieCred = cookieList.get(process.env.CREDENTIALS_COOKIE_KEY!);
    if (!cookieCred) {
      throw new Error("Invalid credential cookie.");
    }
    console.log({ cookieCred });
    const credentials = JSON.parse(cookieCred.value);
    oAuth2Client.setCredentials(credentials);
    const gmail = google.gmail({
      version: "v1",
      auth: oAuth2Client,
    });

    const { attachments, message, subject, to } =
      rest.data! as unknown as MailCompose;

    // Construct email
    const boundary = "boundary-string";
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString(
      "base64"
    )}?=`;
    const messageParts = [
      `From: me`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/mixed; boundary=${boundary}`,
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=utf-8",
      "Content-Transfer-Encoding: quoted-printable",
      "",
      message,
      "",
    ];

    // console.log(JSON.stringify(attachments, null, 2));

    // Add attachments if any
    if (attachments.length > 0) {
      for (const attachment of attachments) {
        const content = Buffer.isBuffer(attachment.content)
          ? attachment.content
          : Buffer.from(attachment.content);
        console.log(
          "Is buffer?",
          attachment.filename,
          Buffer.isBuffer(attachment.content)
        );
        messageParts.push(
          `--${boundary}`,
          `Content-Type: ${attachment.contentType}; name="${attachment.filename}"`,
          `Content-Disposition: attachment; filename="${attachment.filename}"`,
          "Content-Transfer-Encoding: base64",
          "",
          content.toString("base64"),
          ""
        );
      }
    }

    // Close the boundary
    messageParts.push(`--${boundary}--`);

    const email = messageParts.join("\n");

    // Encode the email in base64url format
    const encodedMessage = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log({ encodedMessage });
    // Send the email
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(res);

    return NextResponse.json({
      success: true,
      message: res.data.id,
    });
  } catch (err) {
    const forRedirection = "Invalid credential cookie.";
    const error = err as Error;

    if (error.message === forRedirection) {
      return NextResponse.redirect(getRedirectURL());
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}
