"server only";
import type { google } from "googleapis";
import type { authenticate } from "@google-cloud/local-auth";
import type { GoogleCredentials } from "./schemas/googleCredentials";

/** Save the payload into cookies. */
export async function retrieveToken(
  client:
    | ReturnType<typeof google.auth.fromJSON>
    | Awaited<ReturnType<typeof authenticate>>,
  clientIdAndSecret: Pick<GoogleCredentials, "client_id" | "client_secret">
) {
  const payload = JSON.stringify({
    type: "authorized_user",
    refresh_token: client.credentials.refresh_token,
    ...clientIdAndSecret,
  });
  return payload;
}
