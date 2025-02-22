import { z } from "zod";

export type SendSMS = z.infer<typeof sendSMSSchema>;

const sendSMSSchema = z.object({
  from: z.string(),
  to: z.string(),
  schedule: z.union([z.null(), z.string()]),
  source: z.enum(["sdk", "dashboard"]),
  body: z.string(),
});

export default sendSMSSchema;
