"use client";
import type {
  ChatBox,
  ChatBoxStringedAttachment,
} from "@/utils/schemas/chatBox";

import { chatCollection, where } from "@/utils/firebase";
import { onSnapshot, query, or, orderBy, limit, and } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useRealtimeMessage(me?: string, to?: string) {
  const whereChatBox = where<keyof ChatBox>;
  const [state, setState] = useState<(ChatBox | ChatBoxStringedAttachment)[]>(
    []
  );

  useEffect(() => {
    if (!to || !me) return;
    console.log({ me, to });

    return () => {
      onSnapshot(
        query(
          chatCollection,
          or(
            ...[
              whereChatBox("to", "==", me),
              whereChatBox("from", "==", me),
              and(
                ...[
                  whereChatBox("from", "==", me),
                  whereChatBox("to", "==", to),
                ]
              ),
            ]
          ),
          orderBy("dateCreated", "desc"),
          limit(10)
        ),
        (snapshot) => {
          if (snapshot.empty) return;
          const chatBoxHolder = [...state];

          for (const doc of snapshot.docs) {
            if (!doc.exists()) continue;
            const chatBox = {
              id: doc.id,
              ...doc.data(),
            } as (typeof state)[number];

            const result = chatBoxHolder.find(({ id }) => id === chatBox.id);
            if (result === undefined) chatBoxHolder.push(chatBox);
            console.log({ current: chatBox, result, chatBoxHolder });
          }

          setState(chatBoxHolder);
        }
      );
    };
    // If state is included, this will keep re-render, and if not, the messages will be limited into the declared limit in the `onSnapshot` method.
  }, [me, to]); // eslint-disable-line

  return { messages: state };
}
