"use client";
import millisecondsToDate from "@/utils/millisecondsToDate";
import type { SMSHistory as SH } from "@/utils/schemas/smsHistory";
import { use } from "react";

export default function SMSHistory(props: { data: Promise<SH> }) {
  const { data } = use(props.data);
  const stringLimit = 15;

  function openModal<T>(props: Record<string, T>) {
    console.log("Show details in UI component:", props);
  }

  return (
    <main className="p-2 border-green-200 border">
      <h3>SMS History</h3>
      <div>
        {data.data.map(
          ({
            message_id,
            to,
            date,
            direction,
            status,
            body,
            country,
            carrier,
          }) => (
            <section key={message_id}>
              <button
                className="border border-pink-300 text-start flex w-full justify-between"
                onClick={() =>
                  openModal({
                    message_id,
                    to,
                    date,
                    direction,
                    status,
                    body,
                    country,
                    carrier,
                  })
                }
              >
                <h2>Recipient: {to}</h2>
                <p className="flex flex-col">
                  <span aria-description="body">
                    Message:
                    {body.length > stringLimit
                      ? body.substring(0, stringLimit)
                      : body}
                  </span>
                  <span aria-description="message-status">{status}</span>
                </p>
                <p>
                  <span aria-description="local-date">
                    {millisecondsToDate(date)}
                  </span>
                </p>
              </button>
            </section>
          )
        )}
      </div>
    </main>
  );
}
