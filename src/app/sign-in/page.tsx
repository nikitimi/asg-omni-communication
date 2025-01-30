import React from "react";
import { Metadata } from "next";
import { TITLE } from "@/utils/constants";
import { SignInButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: `${TITLE} - SignIn`,
};

export default function SignIn() {
  return (
    <div>
      <h2>SignIn</h2>
      <SignInButton />
    </div>
  );
}
