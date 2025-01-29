"use client";
import { googleAuthorize } from "@/utils/googleAuthorize";
import React from "react";

/** For uploading json files. */
export default function TestGoogleAuth() {
  const mimeTypesAllowlist = ["application/json"];
  React.useEffect(() => {}, []);

  return (
    <div>
      <input
        type="file"
        multiple={false}
        accept=".json"
        onChange={async (e) => {
          const files = e.target.files;
          if (!files) return console.log("No files.");
          const file = files[0];

          if (!mimeTypesAllowlist.includes(file.type)) {
            return console.log(`File has invalid type: ${file.type}`);
          }

          // This is a JSON file.
          await googleAuthorize();
        }}
      />
    </div>
  );
}
