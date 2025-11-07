'use client';

import React, { useState } from 'react';
import Conversation from './Conversation';
import { Header } from './Header';
import InputBox from './InputBox';

export type ChatMessage = {
  id: string;
  role: 'user' | 'bot';
  text: string;
};

/* ---------- Helpers to parse and format the API response ---------- */

// Try to turn JSON-ish strings into a real object (no eval)
function parseJsonish(input: string): Record<string, any> | null {
  let s = input?.trim();
  if (!s || !s.startsWith('{') || !s.endsWith('}')) return null;

  // 1) Quote keys like start_month or HDD/CDD or reason
  s = s.replace(/([{,]\s*)([A-Za-z_\/]+)\s*:/g, '$1"$2":');
  console.log("1", s)
  // 2) Normalize single quotes around values
  s = s.replace(/'/g, '"');
  console.log("2", s)
  // 3) Quote bareword values like June, CDD
  s = s.replace(/:\s*([A-Za-z]+)\s*(?=[,}])/g, ': "$1"');
  console.log("1", s)

  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

type Rec = {
  start_month?: string;
  end_month?: string;
  ['HDD/CDD']?: string;
  type?: string;
  explanation?: string;
};

function buildRecommendation(rec: Rec): string | null {
  const type = rec['HDD/CDD'] ?? rec.type;
  const start = rec.start_month;
  const end = rec.end_month;

  if (!type || !start || !end) return null;

  return `Based on your career and location, I recommend focusing on **${String(
    type
  ).toUpperCase()}** contracts from **${start}** through **${end}**.`;
}

function formatFinalOutput(args: {
  recSentence: string | null;
  recommendationFallback?: string | null;
}): string {
  const { recSentence, recommendationFallback } = args;

  const recommendationLine =
    recSentence ??
    (recommendationFallback && recommendationFallback.trim()
      ? recommendationFallback.trim()
      : 'Here is the recommendation based on the inputs provided.');

  return `${recommendationLine}`;
}

/* ----------------------------------------------------------------- */

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text:
        "👋 Hi there! I’m your Weather Trade Advisor. I can help you understand which weather futures, Heating Degree Days (HDD) or Cooling Degree Days (CDD), are most relevant for your career and location — so you can better plan or hedge against seasonal trends!\n\nPlease start by entering your **career** and **selecting your state** from the dropdown below.",
    },
  ]);

  const handleSend = async ({
    text,
    optionValue,
    optionLabel,
  }: {
    text: string;
    optionValue: string; // state abbreviation (for API)
    optionLabel: string; // full state name (for display)
  }) => {
    const clean = text.trim();
    if (!clean || !optionValue) return;

    // Show full state name in the user bubble (Markdown)
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: `**Career:** ${clean}\n**Location:** ${optionLabel}`,
    };
    setMessages((m) => [...m, userMsg]);

    const loadingId = crypto.randomUUID();
    setMessages((m) => [...m, { id: loadingId, role: 'bot', text: 'typing...' }]);

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send abbreviation to API
        body: JSON.stringify({ career: clean, state: optionValue }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const isJson =
        res.headers.get('content-type')?.includes('application/json') ?? false;

      let replyText: string;

      if (isJson) {
        const data: any = await res.json();

        // Try multiple shapes:
        // 1) Top-level recommendation object
        let rec: Rec | null = null;
        let plain: string | null = null;

        if (data && typeof data === 'object') {
          if (data.start_month || data.end_month || data['HDD/CDD'] || data.type || data.explanation) {
            rec = data as Rec;
          } else if (data.res && typeof data.res === 'object') {
            rec = data.res as Rec;
          } else if (typeof data.res === 'string') {
            rec = parseJsonish(data.res) as Rec | null;
            if (!rec) plain = data.res;
          } else if (typeof data.message === 'string' && typeof data.res === 'undefined') {
            plain = data.message;
          }
        } else if (typeof data === 'string') {
          rec = parseJsonish(data) as Rec | null;
          if (!rec) plain = data;
        }

        const sentence = rec ? buildRecommendation(rec) : null;
        
        replyText = formatFinalOutput({
          recSentence: sentence,
          recommendationFallback: rec ? null : plain ?? null,
        });
      } else {
        // Non-JSON: try to parse json-ish, else raw text
        const raw = await res.text();
        const rec = parseJsonish(raw) as Rec | null;
        const sentence = buildRecommendation(rec ?? {});

        replyText = formatFinalOutput({
          recSentence: sentence,
          recommendationFallback: rec ? null : raw,
        });
      }

      setMessages((m) =>
        m.map((msg) => (msg.id === loadingId ? { ...msg, text: replyText } : msg))
      );
    } catch (err) {
      console.error(err);
      setMessages((m) =>
        m.map((msg) =>
          msg.id === loadingId
            ? { ...msg, text: '⚠️ Sorry, I couldn’t reach the service.' }
            : msg
        )
      );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col text-white">
      <Header />
      <Conversation messages={messages} />
      <InputBox onSend={handleSend} />
    </div>
  );
}
