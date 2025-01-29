import { z } from "zod";

export type SMSHistory = z.infer<typeof smsHistorySchema>;
/** Status code, response, and descriptions from: https://developers.clicksend.com/docs/#status-codes. */
const smsHistoryBaseResponseEnum = z.union([
  z.object({
    Status: z.literal(200),
    Response: z.literal("SUCCESS"),
    Description: z.literal("Request completed successfully."),
  }),
  z.object({
    Status: z.literal(201),
    Response: z.literal("CREATED"),
    Description: z.literal(
      "Request has been fulfilled and has resulted in one or more new resources being created"
    ),
  }),
  z.object({
    Status: z.literal(204),
    Response: z.literal("NO_CONTENT"),
    Description: z.literal(
      "the server has successfully fulfilled the request and that there is no additional content to send in the response payload body"
    ),
  }),
  z.object({
    Status: z.literal(400),
    Response: z.literal("BAD_REQUEST"),
    Description: z.literal(
      "The request was invalid or cannot be otherwise served. An accompanying error message will explain further."
    ),
  }),
  z.object({
    Status: z.literal(401),
    Response: z.literal("UNAUTHORIZED"),
    Description: z.literal(
      "Authentication credentials were missing or incorrect."
    ),
  }),
  z.object({
    Status: z.literal(403),
    Response: z.literal("FORBIDDEN"),
    Description: z.literal(
      "The request is understood, but it has been refused or access is not allowed. An accompanying error message will explain why."
    ),
  }),
  z.object({
    Status: z.literal(404),
    Response: z.literal("NOT_FOUND"),
    Description: z.literal(
      "The URI requested is invalid or the resource requested does not exists."
    ),
  }),
  z.object({
    Status: z.literal(405),
    Response: z.literal("METHODNOTALLOWED"),
    Description: z.literal("Method doesn't exist or is not allowed."),
  }),
  z.object({
    Status: z.literal(429),
    Response: z.literal("TOOMANYREQUESTS"),
    Description: z.literal(
      "Rate Limit Exceeded. Returned when a request cannot be served due to the application�s rate limit having been exhausted for the resource. See Rate Limiting."
    ),
  }),
  z.object({
    Status: z.literal(500),
    Response: z.literal("INTERNALSERVERERROR"),
    Description: z.literal("Something is broken"),
  }),
]);
const smsHistorySchema = z
  .object({
    data: z.object({
      total: z.number(),
      per_page: z.number(),
      current_page: z.number(),
      last_page: z.number(),
      next_page_url: z.union([z.null(), z.string()]),
      prev_page_url: z.union([z.null(), z.string()]),
      from: z.number(),
      to: z.number(),
      data: z.array(
        z.object({
          direction: z.string(),
          date: z.union([z.number(), z.undefined()]),
          date_added: z.union([z.number(), z.undefined()]),
          to: z.string(),
          body: z.string(),
          status: z.string(),
          from: z.string(),
          schedule: z.string(),
          status_code: z.union([z.null(), z.string()]),
          status_text: z.union([z.null(), z.string()]),
          error_code: z.string(),
          error_text: z.string(),
          message_id: z.string(),
          message_parts: z.number(),
          message_price: z.string(),
          from_email: z.union([z.null(), z.string()]),
          list_id: z.any(),
          custom_string: z.string(),
          contact_id: z.union([z.number(), z.null()]),
          user_id: z.number(),
          subaccount_id: z.number(),
          country: z.string(),
          carrier: z.string(),
          first_name: z.string(),
          last_name: z.string(),
          _api_username: z.string(),
          _media_file_url: z.union([z.string(), z.undefined()]),
        })
      ),
    }),
  })
  .and(smsHistoryBaseResponseEnum);

export default smsHistorySchema;
