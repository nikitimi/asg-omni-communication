import { z } from "zod";

const googleOAuth2CallbackSchema = z.object({
  code: z.string(),
  scope: z.string(),
});

export default googleOAuth2CallbackSchema;
