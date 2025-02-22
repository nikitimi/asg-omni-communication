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
    (
    <div>
      <Navigation />
      <h2>SignIn</h2>
      <SignInButton />
    </div>
  )
  );
}
