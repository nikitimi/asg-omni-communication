import type { SendSMS } from "@/utils/schemas/sendSMS";

import twilio from "twilio";

export default async function sendSMS(props: SendSMS) {
  const { accountSid, authToken, body, to } = props;
  const client = twilio(accountSid, authToken);

  const message = await client.messages.create({
    body,
    from: process.env.NEXT_PUBLIC_TWILIO_NUMBER,
    to,
  });

  return message;
}
