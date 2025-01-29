import React from "react";

import createAuthorization from "@/utils/createAuthorization";
import SMSHistory from "@/components/SMSHistory";
import Navigation from "@/components/Navigation";

export default async function Dashboard() {
  const historyEndpoint = new URL(
    "./sms/history",
    process.env.NEXT_PUBLIC_CLICKSEND_URL
  );
  const response = await fetch(historyEndpoint, {
    headers: {
      method: "GET",
      authorization: createAuthorization(),
    },
  });

  if (!response.ok) {
    console.log(await response.json());
    return <div>Error in getting history</div>;
  }

  return (
    <div>
      <Navigation />
      <p>Dashboard</p>
      <SMSHistory data={response.json()} />
    </div>
  );
}
