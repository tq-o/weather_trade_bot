import Image from "next/image";
import Chat from "./components/Chat";

export default function Home() {
  return (
    <div className="flex h-screen min-h-screen items-center justify-center bg-[#D8F3DC] font-sans">
      <Chat />
    </div>
  );
}
