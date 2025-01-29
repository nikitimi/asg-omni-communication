import { z } from "zod";

type EmailAttachment = {
  filename: string;
  content: Buffer<ArrayBufferLike>;
  contentType: string;
};

export type MailCompose = z.infer<typeof noAttachments> & Attachment;
type Attachment = { attachments: EmailAttachment[] };

const mailComposeSchema = z.object({
  to: z.string(),
  subject: z.string(),
  message: z.string(),
  attachments: z.array(z.any()),
});

export const noAttachments = mailComposeSchema.omit({ attachments: true });
export default mailComposeSchema;
