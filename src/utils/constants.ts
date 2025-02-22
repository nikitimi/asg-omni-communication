export const TITLE = "Omni-communication | ASG";
/** Authorization scopes required by the API; multiple scopes can be included, separated by spaces. */
export const SCOPES =
  "https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.compose https://mail.google.com/";
export const CLICKSEND_BASE_HEADERS = {
  host: "rest.clicksend.com",
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.5",
  "accept-encoding": "gzip, deflate, br, zstd",
  "x-requested-with": "XMLHttpRequest",
  "content-type": "application/json;charset=utf-8",
  origin: "https://dashboard.clicksend.com",
  connection: "keep-alive",
  referer: "https://dashboard.clicksend.com/",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
};
