import React from "react";
import { Metadata } from "next";
import { TITLE } from "@/utils/constants";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: `${TITLE} - SignIn`,
};

export default function SignIn() {
  return (
    <div>
      <Navigation />
      <p>SignIn</p>
    </div>
  );
}
