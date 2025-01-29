"server only";
export default function createAuthorization() {
  const base64UP = `${process.env.CLICKSEND_USERNAME}:${process.env.CLICKSEND_API_KEY}`;
  return `Basic ${btoa(base64UP)}`;
}
