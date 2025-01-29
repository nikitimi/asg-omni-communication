"use client";
import type { SMSHistory as SH } from "@/utils/schemas/smsHistory";

import millisecondsToDate from "@/utils/millisecondsToDate";
import Image from "next/image";

export default function SMSHistory(props: { responses: SH[] }) {
  const [SMS, MMS] = props.responses;
  const stringLimit = 15;

  console.log(props.responses);

  function openModal<T>(props: Record<string, T>) {
    console.log("Show details in UI component:", props);
  }

  return (
    <main>
      <section className="p-2 border-green-200 border">
        <h3>SMS History</h3>
        <div>
          {SMS.data.data.map(
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
                      {millisecondsToDate(date ?? 0)}
                    </span>
                  </p>
                </button>
              </section>
            )
          )}
        </div>
      </section>
      <section className="p-2 border-green-200 border">
        <h3>MMS History</h3>
        <div>
          {MMS.data.data.map(
            ({
              message_id,
              to,
              _media_file_url,
              date_added,
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
                      _media_file_url,
                      date_added,
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
                      {millisecondsToDate(date_added ?? 0)}
                    </span>
                  </p>
                  <div className="w-auto h-auto bg-white">
                    {_media_file_url ? (
                      <Image
                        src={_media_file_url}
                        alt=""
                        width={60}
                        height={60}
                        priority={false}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </button>
              </section>
            )
          )}
        </div>
      </section>
    </main>
  );
}
