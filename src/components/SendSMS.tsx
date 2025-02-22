"use client";
import React, { type FormEvent } from "react";

import { CLICKSEND_BASE_HEADERS } from "@/utils/constants";
import sendSMSSchema, { type SendSMS } from "@/utils/schemas/sendSMS";
import testNumbers from "@/utils/testNumbers";

export default function SendSMS(props: { auth: string }) {
  console.log(props.auth);
  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const { success, ...rest } = sendSMSSchema.safeParse(
      Object.fromEntries(formdata.entries())
    );

    try {
      if (!success) throw new Error(rest.error!.message);
      const message = rest.data! as SendSMS;
      const SMSSendingEndpoint = new URL(
        "./sms/send",
        process.env.NEXT_PUBLIC_CLICKSEND_URL ?? ""
      );
      const body = {
        messages: [
          {
            ...message,
            schedule: message.schedule === "null" ? null : message.schedule,
          },
        ],
        exclude_no_sender_id_recipients: false,
      };

      await fetch(SMSSendingEndpoint, {
        method: "POST",
        headers: {
          ...CLICKSEND_BASE_HEADERS,
          authorization: props.auth,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.log((err as Error).message);
    }
  }
  return (
    <div>
      <p>SendSMS</p>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-2 border border-green-200"
      >
        <input
          type="text"
          name="from"
          placeholder="myNumber"
          required
          className="text-black"
        />
        <select name="to" required className="text-black">
          {testNumbers.map((number) => (
            <option key={number}>{number}</option>
          ))}
        </select>
        <input type="hidden" name="schedule" value="null" required />
        <input type="hidden" name="source" value="dashboard" required />
        <input
          type="text"
          name="body"
          placeholder="body"
          required
          className="text-black"
        />
        <button type="submit">Send SMS</button>
      </form>
    </div>
  );
}
