import { type NextRequest, NextResponse } from "next/server";
import sendSMSSchema from "@/utils/schemas/sendSMS";
import sendSMS from "@/utils/twilio/sendSMS";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export async function GET() {
  //TODO: Remove in production.
  return NextResponse.json({ message: `${accountSid} & ${authToken}.` });
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { success, ...rest } = sendSMSSchema
    .pick({
      body: true,
      from: true,
      to: true,
    })
    .safeParse(json);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid structure of request sent from the client.",
      },
      { status: 400 }
    );
  }

  if (!accountSid || !authToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Private environmental variables are empty.",
      },
      { status: 400 }
    );
  }

  try {
    const message = await sendSMS({ accountSid, authToken, ...rest.data! });
    return NextResponse.json({
      success: true,
      message: `Message send with SID: ${message.sid}.`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: `Sending SMS failed: ${(err as Error).message}`,
      },
      { status: 400 }
    );
  }
}
