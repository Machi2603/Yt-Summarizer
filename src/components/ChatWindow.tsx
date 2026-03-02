"use client";

import { useRef, useEffect } from "react";
import Message from "./Message";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "loading";
  content: string;
  videoTitle?: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-dark-300 mb-2">
            YT Summarizer
          </h2>
          <p className="text-dark-500">
            Pega una URL de YouTube para obtener un resumen
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            type={msg.type}
            content={msg.content}
            videoTitle={msg.videoTitle}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
