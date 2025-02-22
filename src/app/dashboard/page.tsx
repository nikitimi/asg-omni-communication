import type { SMSHistory } from "@/utils/schemas/smsHistory";

import React from "react";

import MessagesHistory from "@/components/MessagesHistory";
import Navigation from "@/components/Navigation";
import SendSMS from "@/components/SendSMS";
import SendMMS from "@/components/SendMMS";
import createAuthorization from "@/utils/createAuthorization";

export default async function Dashboard() {
  const smsHistoryEndpoint = new URL(
    "./sms/history",
    process.env.NEXT_PUBLIC_CLICKSEND_URL
  );
  const mmsHistoryEndpoint = new URL(
    "./mms/history",
    process.env.NEXT_PUBLIC_CLICKSEND_URL
  );
  const requests = [
    fetch(smsHistoryEndpoint, {
      headers: {
        method: "GET",
        authorization: createAuthorization(),
      },
    }),
    fetch(mmsHistoryEndpoint, {
      headers: {
        method: "GET",
        authorization: createAuthorization(),
      },
    }),
  ];
  const responses = await Promise.allSettled(requests);
  const responseValues: SMSHistory[] = [];

  for (const response of responses.filter(
    (response) => response.status === "fulfilled"
  )) {
    const json = await response.value.json();
    if (response.value.ok) {
      responseValues.push(json);
    }
  }

  if (responseValues.length !== requests.length) {
    return <div>Requests not all fullfilled.</div>;
  }

  return (
    <div>
      <Navigation />
      <p>Dashboard</p>
      <SendSMS auth={createAuthorization()} />
      <SendMMS auth={createAuthorization()} />
      <MessagesHistory responses={responseValues} />
    </div>
  );
}
