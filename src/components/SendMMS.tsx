"use client";
import React, { type FormEvent } from "react";

import { CLICKSEND_BASE_HEADERS } from "@/utils/constants";
import sendMMSSchema, { type SendMMS } from "@/utils/schemas/sendMMS";
import testNumbers from "@/utils/testNumbers";

export default function SendMMS(props: { auth: string }) {
  console.log(props.auth);
  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const { success, ...rest } = sendMMSSchema.safeParse(
      Object.fromEntries(formdata.entries())
    );

    try {
      if (!success) throw new Error(rest.error!.message);
      const { media_file, ...message } = rest.data! as SendMMS;
      console.log("UPLOAD ME IN S3", media_file);
      const mmsSendingEndpoint = new URL(
        "./mms/send",
        process.env.NEXT_PUBLIC_CLICKSEND_URL ?? ""
      );
      const body = {
        media_file:
          "https://tshb7tup6e.ufs.sh/f/TcMurjzFRPKaYMFU24g32aBjwUTPzhNsDWkKAv5E1bqlLF4x",
        messages: [
          {
            ...message,
            schedule: message.schedule === "null" ? null : message.schedule,
          },
        ],
        show_summary: true,
        exclude_no_sender_id_recipients: false,
      };

      await fetch(mmsSendingEndpoint, {
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
      <p>SendMMS</p>
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
        <input
          type="text"
          name="subject"
          placeholder="subject"
          required
          className="text-black"
        />
        <input type="hidden" name="schedule" value="null" required />
        <select name="to" required className="text-black">
          {testNumbers.map((number) => (
            <option key={number}>{number}</option>
          ))}
        </select>
        <input
          type="text"
          name="body"
          placeholder="body"
          required
          className="text-black"
        />
        <input type="file" name="media_file" accept=".jpg" required />
        <button type="submit">Send MMS</button>
      </form>
    </div>
  );
}
