import googleOAuth2 from "@/utils/googleOAuth2";
import { SCOPES } from "@/utils/constants";

describe("Get User consent in pop-up browser's window.", () => {
  it("This should return a URL for redirection and getting the OAuth2.0 code.", () => {
    const redirectURL = "http://localhost:3000/oauthcallback/";
    const templateURLString = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=${encodeURIComponent(
      SCOPES
    )}&response_type=code&client_id=${
      process.env.GMAIL_WEB_CLIENT_ID
    }&redirect_uri${encodeURIComponent(redirectURL)}`;

    expect(googleOAuth2(redirectURL)).toBe(templateURLString);
  });
});
