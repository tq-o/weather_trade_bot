// import React from 'react'
// import { Box, Button, TextField } from '@mui/material'
// import { styled } from '@mui/material/styles';

// export const InputBox = () => {
//   return (
//     <Box className="flex"> 
//         <TextField className="w-full bg-white"/>
//         <Button 
//             sx={{
//                 color: 'white',
//                 background: '#2D6A4F'
//             }}
//         >
//             Send
//         </Button>
//     </Box>
//   )
// }

"use client";

import { useState } from "react";

export default function InputBox({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="w-full h-16 fixed bottom-0 left-0 bg-[#0B132B]/95 backdrop-blur
                    border-t border-white/10 flex items-center gap-2 px-3">
      <input
        className="flex-1 h-10 rounded-xl bg-white text-black px-3 outline-none"
        placeholder="Type your message…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button
        onClick={submit}
        className="h-10 px-4 rounded-xl bg-[#2D6A4F] text-white font-medium disabled:opacity-50"
        disabled={!value.trim()}
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
}
