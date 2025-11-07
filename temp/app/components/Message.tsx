// // import type { ChatMessage } from "./Chat";

// // export default function Message({ msg }: { msg: ChatMessage }) {
// //   const isUser = msg.role === "user";
// //   return (
// //     <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
// //       <div
// //         className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm
// //         ${isUser ? "bg-[#00FF99] text-black" : "bg-[#1E2A47] text-white"}`}
// //       >
// //         {msg.text}
// //       </div>
// //     </div>
// //   );
// // }

// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import type { ChatMessage } from "./Chat";

// export default function Message({ msg }: { msg: ChatMessage }) {
//   const isUser = msg.role === "user";

//   return (
//     <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
//       <div
//         className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap
//         ${isUser ? "bg-[#00FF99] text-black" : "bg-[#1E2A47] text-white"}`}
//       >
//         {/* ✅ Markdown wrapper added */}
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm]}
//           components={{
//             p: ({ children }) => <p className="">{children}</p>,
//             li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
//             strong: ({ children }) => (
//               <strong className="font-semibold">{children}</strong>
//             ),
//           }}
//         >
//           {msg.text}
//         </ReactMarkdown>
//       </div>
//     </div>
//   );
// }
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "./Chat";

export default function Message({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap
        ${isUser ? "bg-[#95D5B2] text-[#081C15]" : "bg-[#40916C] text-white"}`}
      >
          {/* Render Markdown for both user and bot so user can send bold labels */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc list-outside pl-6 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside pl-6 space-y-1">{children}</ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            }}
          >
            {msg.text}
          </ReactMarkdown>
      </div>
    </div>
  );
}
