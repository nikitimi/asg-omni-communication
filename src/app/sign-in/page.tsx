import React from "react";
import { Metadata } from "next";
import { TITLE } from "@/utils/constants";

export const metadata: Metadata = {
  title: `${TITLE} - SignIn`,
};

export default function SignIn() {
  return <div>SignIn</div>;
}
