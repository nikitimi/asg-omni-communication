"server only";
import { google } from "googleapis";

export default function googleOAuth2(redirectUrl: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_WEB_CLIENT_ID,
    process.env.GMAIL_WEB_CLIENT_SECRET,
    redirectUrl
  );
  return oauth2Client;
}
