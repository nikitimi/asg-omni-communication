import { z } from "zod";

export type SendSMS = z.infer<typeof sendSMSSchema>;

const sendSMSSchema = z.object({
  accountSid: z.string(),
  authToken: z.string(),
  body: z.string(),
  to: z.string(),
});

export default sendSMSSchema;
