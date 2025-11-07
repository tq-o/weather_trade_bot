"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "./Chat";
import Message from "./Message";

type Props = { messages: ChatMessage[] };

export default function Conversation({ messages }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto pt-16 pb-24 px-4 space-y-2">
      {messages.map((m) => (
        <Message key={m.id} msg={m} />
      ))}
      <div ref={endRef} />
    </main>
  );
}
