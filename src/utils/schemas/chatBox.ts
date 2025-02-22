import { z } from "zod";

export type ChatBox = z.infer<typeof chatBoxSchema>;
export type ChatBoxStringedAttachment = Omit<
  z.infer<typeof chatBoxSchema>,
  "attachments"
> & {
  attachments: string;
};

const chatBoxSchema = z.object({
  id: z.union([z.string(), z.undefined()]),
  to: z.string(),
  from: z.string(),
  dateCreated: z.number(),
  message: z.string(),
  attachments: z.array(
    z.object({
      key: z.string(),
      url: z.string(),
    })
  ),
});

export default chatBoxSchema;
