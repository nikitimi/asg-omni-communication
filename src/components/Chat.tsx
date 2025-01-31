"use client";
import { FormEvent, use, useRef, useState } from "react";
import { addDoc } from "firebase/firestore";
import Link from "next/link";

import { useUser } from "@clerk/nextjs";
import useRealtimeMessage from "@/hooks/useRealtimeMessage";
import { chatCollection } from "@/utils/firebase";
import { ChatBox } from "@/utils/schemas/chatBox";

type InitialState = {
  to?: string;
  status: "sending" | "idle" | "initializing";
};
const initialState: InitialState = {
  status: "initializing",
};

export default function Chat<T>(props: { data: Promise<T> }) {
  const [state, setState] = useState(initialState);
  const users = use(props.data) as Record<string, any>[]; // eslint-disable-line
  const userResource = useUser();
  const emailAddress = userResource.user?.emailAddresses[0].emailAddress;
  const { messages } = useRealtimeMessage(emailAddress, state.to);
  const otherUsers = users.filter((user) => user.id !== userResource.user?.id);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputFilesRef = useRef<HTMLInputElement>(null);

  const isInputsDisabled =
    typeof state.to !== "string" && state.status !== "idle";

  async function saveToChatCollection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, status: "sending" }));
    const formdata = new FormData(e.currentTarget);

    if (!state.to) return console.error("No recipient.");

    const response = await fetch(
      new URL("/api/v1/uploadthing", process.env.NEXT_PUBLIC_WEB_ORIGIN),
      {
        method: "POST",
        body: formdata,
      }
    );
    const message = formdata.get("message");

    if (typeof message !== "string") {
      console.error("message has incorrect file type.");
    }

    const json = await response.json();
    if (!response.ok) {
      return console.error(json);
    }

    const date = new Date();
    const chat = {
      to: state.to,
      from: users.find((user) => user.id === userResource.user?.id)
        ?.emailAddresses[0].email_address,
      dateCreated: date.getTime(),
      message,
      attachments: JSON.stringify(json.message),
    };

    try {
      console.log(chat);
      const result = await addDoc(chatCollection, chat);
      console.log(`Transaction ID: ${result.id}`);
    } catch (err) {
      console.error((err as Error).message);
    }

    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
    if (inputFilesRef.current) {
      inputFilesRef.current.value = "";
    }
    setState((prevState) => ({ ...prevState, status: "idle" }));
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="bg-white shadow-sm p-4 flex items-center space-x-3">
          <select
            value={state.to}
            className="w-full text-black px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-700 focus:border-transparent"
            onChange={(e) => {
              if (!e.currentTarget.firstElementChild) return;

              const { firstElementChild } = e.currentTarget;

              const optionValue = firstElementChild.getAttribute("value");
              const isDefaultOption =
                typeof optionValue === "string" &&
                parseInt(optionValue, 10) === -1;

              if (isDefaultOption) firstElementChild.remove();
              setState((prevState) => ({ ...prevState, to: e.target.value }));
            }}
          >
            <option value={-1} unselectable="on">
              Select a user to chat with...
            </option>
            {otherUsers.map((user) => (
              <option
                key={user.id}
                value={user.email_addresses[0].email_address}
              >
                {user.email_addresses[0].email_address}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages
            .filter((chat) => chat.from === state.to || chat.to === state.to)
            .sort((a, b) => a.dateCreated - b.dateCreated)
            .map(({ id, message, from, dateCreated, attachments }) => (
              <div
                key={id}
                className={`flex ${
                  from === userResource.user?.emailAddresses[0].emailAddress
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="flex max-w-[80%] items-end space-x-2">
                  <div className="w-12 h-12 rounded-full bg-green-700 flex-shrink-0 flex items-center justify-center text-white text-xs">
                    <p>{from.substring(0, 2).toLocaleUpperCase()}</p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      from === userResource.user?.emailAddresses[0].emailAddress
                        ? "bg-green-700 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow"
                    }`}
                  >
                    <p className="break-words">{message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(dateCreated).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {typeof attachments === "string" && (
                      <div>
                        {(
                          JSON.parse(attachments) as ChatBox["attachments"]
                        ).map(({ key, url }, index) => (
                          <Link key={key} href={url} target="_blank">
                            {`Attachment-${index + 1}`}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="bg-white border-t p-4">
          <form className="flex space-x-4" onSubmit={saveToChatCollection}>
            <div className="flex-1">
              <textarea
                rows={1}
                ref={textAreaRef}
                name="message"
                disabled={isInputsDisabled}
                className="w-full text-black px-4 disabled:bg-slate-300 disabled:text-slate-400 py-2 border border-gray-200 rounded-full resize-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                placeholder="Type a message..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={isInputsDisabled}
                className="p-3 text-gray-500 disabled:bg-slate-300 disabled:text-slate-400 hover:bg-gray-100 rounded-full w-8 h-8 relative"
              >
                <input
                  ref={inputFilesRef}
                  disabled={isInputsDisabled}
                  className=" w-full h-full absolute z-10 inset-0 opacity-0"
                  type="file"
                  name="files"
                  multiple
                />
                <svg
                  className="h-full w-full absolute inset-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <button
                type="submit"
                disabled={isInputsDisabled}
                className="px-4 py-2 disabled:bg-slate-300 disabled:text-slate-400 bg-green-700 text-white rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
