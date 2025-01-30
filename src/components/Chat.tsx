"use client";
import { FormEvent, use, useEffect, useState } from "react";
import firebase from "@/utils/firebase";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { User } from "@clerk/backend";

type ChatBox = {
  id?: string;
  to: string;
  from: string;
  dateCreated: number;
  message: string;
  attachments?: {
    key: string;
    url: string;
  }[];
};
type InitialState = {
  chatBox: ChatBox[];
};
const initialState: InitialState = {
  chatBox: [],
};

export default function Chat(props: {
  data: Promise<{
    success: boolean;
    message: { data: User[]; totalCount: number };
  }>;
}) {
  const data = use(props.data);
  const users = data.message;
  const [state, setState] = useState(initialState);
  const firestore = getFirestore(firebase);
  const chatCollection = collection(firestore, "chats");

  async function saveToChatCollection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const response = await fetch("/api/v1/uploadthing", {
      method: "POST",
      body: formdata,
    });
    const chatArea = formdata.get("chat-area");

    if (typeof chatArea !== "string") {
      console.error("chatArea has incorrect file type.");
    }

    const json = await response.json();
    if (!response.ok) {
      return console.error(json);
    }

    const date = new Date();
    const chat = {
      to: formdata.get("to"),
      from: formdata.get("from"),
      dateCreated: date.getTime(),
      message: chatArea,
      attachments: json.message,
    };
    addDoc(chatCollection, chat);
  }

  useEffect(
    () =>
      onSnapshot(chatCollection, (snapshot) => {
        if (!snapshot.empty) {
          const chatBox: ChatBox[] = [];
          snapshot.docs.forEach((doc) => {
            if (doc.exists()) {
              chatBox.push({
                id: doc.id,
                ...(doc.data() as Omit<ChatBox, "id">),
              });
            }
          });
          setState((prevState) => ({ ...prevState, chatBox }));
        }
      }),
    []
  );

  const myEmail = "giancarloacarranza@gmail.com";

  return (
    <>
      {
        <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50 p-4">
          <section
            aria-description="chatbox"
            className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-white rounded-lg shadow"
          >
            {(
              [
                {
                  dateCreated: 123,
                  from: myEmail,
                  message: "Legggo",
                  to: "carranzagcarlo@gmail.com",
                  id: "1",
                },
                {
                  dateCreated: 123,
                  from: "carranzagcarlo@gmail.com",
                  message: "Wazzzup",
                  to: myEmail,
                  id: "2",
                },
                {
                  dateCreated: 123,
                  from: myEmail,
                  message: "wuzGod?",
                  to: "carranzagcarlo@gmail.com",
                  id: "3",
                },
              ] as ChatBox[]
            ).map(({ id, message, from, to, dateCreated }) => (
              <div
                key={id}
                className={`${
                  to === myEmail ? "flex-row-reverse" : "flex-row"
                }  flex items-center gap-2 space-x-2`}
              >
                <div
                  className="w-20 h-20 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-medium"
                  aria-description="profile-image"
                >
                  US
                </div>
                <div
                  className={`flex-1 bg-gray-100 rounded-lg ${
                    to === myEmail
                      ? "rounded-tl-none text-end"
                      : "rounded-tr-none "
                  }  p-4`}
                >
                  <p className="text-gray-800">{message}</p>
                  <p className="text-black">{from}</p>
                  <p className="text-black">{to}</p>
                  <p className="text-black">{dateCreated}</p>
                </div>
              </div>
            ))}
          </section>

          <form
            onSubmit={saveToChatCollection}
            className="bg-white rounded-lg shadow p-4 space-y-4"
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="to"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To:
                </label>
                <select
                  id="to"
                  name="to"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {users.data.map((user, index) => (
                    <p key={index}>{user.primaryEmailAddress?.emailAddress}</p>
                  ))}
                </select>
              </div>

              <input type="hidden" name="from" />

              {/* File Upload */}
              <div>
                <label
                  htmlFor="files"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Attachments:
                </label>
                <input
                  type="file"
                  id="files"
                  name="files"
                  required
                  multiple
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                        file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
              </div>

              {/* Message Input */}
              <div>
                <label
                  htmlFor="chat-area"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message:
                </label>
                <textarea
                  id="chat-area"
                  name="chat-area"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-description="textarea"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium
                    hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    transition-colors duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      }
    </>
  );
}
