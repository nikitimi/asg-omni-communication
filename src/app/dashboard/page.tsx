import React from "react";

import createAuthorization from "@/utils/createAuthorization";
import SMSHistory from "@/components/SMSHistory";
import Navigation from "@/components/Navigation";
import SendSMS from "@/components/SendSMS";
import type { SMSHistory as SH } from "@/utils/schemas/smsHistory";

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
  const responseValues: SH[] = [];

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
      <SendSMS />
      <SMSHistory responses={responseValues} />
    </div>
  );
}
