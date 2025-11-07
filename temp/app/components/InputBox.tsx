"use client";

import { useState } from "react";
import { USStates } from "../data";

type InputBoxProps = {
  onSend: (payload: { text: string; optionValue: string; optionLabel: string }) => void;
  options?: { label: string; value: string }[];
  optionPlaceholder?: string;
};

export default function InputBox({
  onSend,
  options = USStates,
  optionPlaceholder = "Select your state",
}: InputBoxProps) {
  const [text, setText] = useState("");
  const [choice, setChoice] = useState("");

  const isValid = text.trim().length > 0 && choice.length > 0;

  const submit = () => {
    if (!isValid) return;
    const selected = options.find(o => o.value === choice);
    if (!selected) return;

    onSend({
        text: text.trim(),
        optionValue: choice,        // abbreviation, e.g. "CA"
        optionLabel: selected.label // full name, e.g. "California"
    });

    setText("");
    setChoice("");
  };

  const onTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onSelectKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="w-full h-16 fixed bottom-0 left-0 bg-[#0B132B]/95 backdrop-blur
                    border-t border-white/10 flex items-center gap-2 px-3">
      {/* Left: text input */}
      <input
        className="flex-1 h-10 rounded-xl bg-white text-black px-3 outline-none"
        placeholder="Type your Career here."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onTextKeyDown}
        aria-label="message"
      />

      {/* Right: dropdown */}
      <select
        className="h-10 min-w-[25rem] rounded-xl bg-white text-black px-3 outline-none"
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
        onKeyDown={onSelectKeyDown}
        aria-label="metric"
      >
        <option value="">{optionPlaceholder}</option>
        {options.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        onClick={submit}
        className="h-10 px-4 rounded-xl bg-[#2D6A4F] text-white font-medium disabled:opacity-50"
        disabled={!isValid}
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
}
