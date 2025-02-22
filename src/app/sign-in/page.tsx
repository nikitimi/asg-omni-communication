import React from "react";
import { Metadata } from "next";
import { TITLE } from "@/utils/constants";
import Navigation from "@/components/Navigation";
import { SignInButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: `${TITLE} - SignIn`,
};

export default function SignIn() {
  return (
    <div>
      <Navigation />
      <section className="flex h-screen items-center justify-center flex-col">
        <h2>⬇ Sign in for Chat ⬇</h2>
        <div className="hover:bg-green-500 bg-green-400 ease-in-out duration-300 w-32 rounded-lg shadow-sm px-2 py-1 text-center">
          <SignInButton />
        </div>
      </section>
    </div>
  );
}
