'use client';

import { useState } from "react";
import { Box } from "@mui/material"
// import { Conversation } from "./Conversation"
import Conversation from "./Conversation"
import { Header } from "./Header"
import InputBox  from "./InputBox"
import React from "react"

export type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "bot", text: "Hi! Ask me about upcoming weather trends 🌦️" },
  ]);

  const handleSend = async ({
    text,
    optionValue,
    optionLabel,
  }: { text: string; optionValue: string; optionLabel: string }) => {
    const clean = text.trim();
    if (!clean || !optionValue) return;

    // ✅ Show full state name in the user bubble
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: `Career: ${clean} \nLocation: ${optionLabel}`, // full name here
    };
    setMessages((m) => [...m, userMsg]);

    const loadingId = crypto.randomUUID();
    setMessages((m) => [...m, { id: loadingId, role: "bot", text: "typing..." }]);

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ Send the abbreviation to the API
        body: JSON.stringify({ city: clean, metric: optionValue }),
        // Consider renaming keys to { career: clean, state: optionValue } if that's what your API expects.
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const isJson = res.headers.get("content-type")?.includes("application/json") ?? false;

      let replyText: string;
      if (isJson) {
        const data: unknown = await res.json();
        replyText =
          typeof (data as any).res === "string"
            ? (data as any).res.replace(/\n{3,}/g, "\n\n").trim()
            : JSON.stringify(data, null, 2);
      } else {
        replyText = (await res.text()).replace(/\n{3,}/g, "\n\n").trim();
      }

      setMessages((m) =>
        m.map((msg) => (msg.id === loadingId ? { ...msg, text: replyText } : msg))
      );
    } catch (err) {
      console.error(err);
      setMessages((m) =>
        m.map((msg) =>
          msg.id === loadingId
            ? { ...msg, text: "⚠️ Sorry, I couldn’t reach the service." }
            : msg
        )
      );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col text-white">
      <Header />
      <Conversation messages={messages} />
      {/* pass the new handler */}
      <InputBox onSend={handleSend} />
    </div>
  );
}
