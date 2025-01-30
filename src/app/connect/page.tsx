import Chat from "@/components/Chat";
import React from "react";

export default async function Connect() {
  const response = await fetch(
    new URL("./api/v1/clerk/getUsers/", process.env.NEXT_PUBLIC_WEB_ORIGIN),
    { method: "GET" }
  );
  return (
    <div>
      <h2>Connect</h2>
      <div aria-description="chatbox" className="border border-white">
        <Chat data={response.json()} />
      </div>
    </div>
  );
}
