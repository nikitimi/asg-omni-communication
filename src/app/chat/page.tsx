import { SignOutButton } from "@clerk/nextjs";
import { Suspense } from "react";
import Chat from "@/components/Chat";

export default async function Connect() {
  const response = await fetch(
    new URL("./v1/users", "https://api.clerk.com/"),
    {
      headers: {
        authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }
  );
  // console.log(await response.json());
  return (
    <div>
      <header className="flex justify-between items-center p-2">
        <h2>Connect</h2>
        <div className="bg-red-400 px-3 rounded-lg">
          <SignOutButton />
        </div>
      </header>
      <div aria-description="chatbox" className="border border-white">
        <Suspense>
          <Chat data={response.json()} />{" "}
        </Suspense>
      </div>
    </div>
  );
}
