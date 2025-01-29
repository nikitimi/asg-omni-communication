import { z } from "zod";

export type GoogleCredentials = z.infer<typeof googleCredentialsSchema>;
const googleCredentialsSchema = z.object({
  client_id: z.string(),
  project_id: z.string(),
  auth_uri: z.string(),
  token_uri: z.string(),
  auth_provider_x509_cert_url: z.string(),
  client_secret: z.string(),
});

export default googleCredentialsSchema;
