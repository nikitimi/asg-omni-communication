import { NextResponse } from "next/server";
import { SMSApi, SmsMessage, SmsMessageCollection } from "clicksend";
import testNumbers from "@/utils/testNumbers";

/** TODO: Convert into post, then add `body`, `from`, and `to` dynamically. */
export async function GET() {
  const username = process.env.CLICKSEND_USERNAME ?? "";
  const apiKey = process.env.CLICKSEND_API_KEY ?? "";

  const smsApi = new SMSApi(username, apiKey);

  console.log(smsApi);

  const smsMessage = new SmsMessage();

  // smsMessage.source = "sdk";
  smsMessage.from = testNumbers[1];
  smsMessage.to = testNumbers[0];
  smsMessage.body = "test message";

  const smsMessageCollection = new SmsMessageCollection();

  smsMessageCollection.messages = [smsMessage];

  try {
    const response = await smsApi.smsSendPost(smsMessageCollection);
    return NextResponse.json({
      success: true,
      message: response.body,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: (err as Error).message,
    });
  }
}
