import { google } from "googleapis";
import { SCOPES } from "./constants";

export async function googleAuthorize(keyFile?: string) {
  const googleAuth = new google.auth.GoogleAuth({
    scopes: SCOPES.split(" "),
    credentials: {

    },
    keyFile,
  });

  console.log(googleAuth);
}
