import React from "react";
import { Metadata } from "next";
import { TITLE } from "@/utils/constants";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: `${TITLE} - SignUp`,
};

export default function SignUp() {
  return (
    <div>
      <Navigation /> <p>SignUp</p>
    </div>
  );
}
