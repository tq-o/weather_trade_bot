// import React from 'react'
// import { Box, Stack } from '@mui/material'
// import { ChatHistory } from '../data'

// export const Message = () => {
//   return (
//     <Box p={3}>
// 			<Stack spacing={3}>
// 				{ChatHistory.map((message: any, index: any) => (
// 					<Box
// 						key={index}
// 					>
// 						{message.message}
// 					</Box>
// 				))}
// 			</Stack>
//     </Box>
//   );
// }
import type { ChatMessage } from "./Chat";

export default function Message({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm
        ${isUser ? "bg-[#00FF99] text-black" : "bg-[#1E2A47] text-white"}`}
      >
        {msg.text}
      </div>
    </div>
  );
}