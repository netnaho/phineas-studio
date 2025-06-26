import { AiToolsPanel } from "@/components/dashboard/ai-tools-panel";
import { AudioPanel } from "@/components/dashboard/audio-panel";
import { ChatPanel } from "@/components/dashboard/chat-panel";
import { Header } from "@/components/dashboard/header";
import { LyricsPanel } from "@/components/dashboard/lyrics-panel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <LyricsPanel />
          </div>
          <div className="lg:col-span-8 xl:col-span-6 space-y-6 lg:space-y-8">
            <AudioPanel />
            <AiToolsPanel />
          </div>
          <div className="lg:col-span-12 xl:col-span-3">
            <ChatPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
