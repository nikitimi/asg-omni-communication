import { z } from "zod";

type MediaFile = { media_file: File };
export type SendMMS = z.infer<typeof noMediaFile> & MediaFile;

const sendMMSSchema = z.object({
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  schedule: z.union([z.null(), z.string()]),
  body: z.string(),
  media_file: z.any(),
});

export const noMediaFile = sendMMSSchema.omit({ media_file: true });
export default sendMMSSchema;
