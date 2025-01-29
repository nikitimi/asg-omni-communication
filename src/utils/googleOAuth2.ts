import { google } from "googleapis";
import { SCOPES } from "./constants";

export default function googleOAuth2(redirectUrl: string) {
  const oauth2Client = new google.auth.OAuth2(
    "984767535208-urgpk976sljog96li927gt522m5p9qs7.apps.googleusercontent.com",
    "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",
    redirectUrl
  );

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope, you can pass it as a string
    scope: SCOPES.split(" "),
  });
  return url;
}
