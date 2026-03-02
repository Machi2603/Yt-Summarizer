"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChatWindow, { ChatMessage } from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";

interface HistoryItem {
  id: string;
  videoTitle: string;
  videoUrl: string;
  minutes: number;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    const res = await fetch("/api/history");
    if (res.ok) {
      const data = await res.json();
      setHistory(data);
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/");
        return;
      }
      const data = await res.json();
      setUsername(data.username);
    }

    checkAuth();
    fetchHistory();
  }, [router, fetchHistory]);

  async function handleSubmit(url: string, minutes: number) {
    setLoading(true);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      type: "user",
      content: url,
    };

    const loadingMsg: ChatMessage = {
      id: "loading",
      type: "loading",
      content: "Extrayendo transcript y generando resumen...",
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, minutes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "loading"),
          {
            id: crypto.randomUUID(),
            type: "assistant",
            content: `**Error:** ${data.error}`,
          },
        ]);
        return;
      }

      // Update user message with video title
      setMessages((prev) =>
        prev
          .map((m) =>
            m.id === userMsg.id
              ? { ...m, videoTitle: `${data.videoTitle} - ${minutes} min` }
              : m
          )
          .filter((m) => m.id !== "loading")
          .concat({
            id: data.id,
            type: "assistant",
            content: data.content,
          })
      );

      fetchHistory();
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "loading"),
        {
          id: crypto.randomUUID(),
          type: "assistant",
          content: "**Error:** No se pudo conectar con el servidor",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectItem(item: HistoryItem) {
    setMessages([
      {
        id: crypto.randomUUID(),
        type: "user",
        content: item.videoUrl,
        videoTitle: `${item.videoTitle} - ${item.minutes} min`,
      },
      {
        id: item.id,
        type: "assistant",
        content: item.content,
      },
    ]);
  }

  function handleNewChat() {
    setMessages([]);
  }

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar
        history={history}
        onSelectItem={handleSelectItem}
        onNewChat={handleNewChat}
        username={username}
      />
      <div className="flex-1 flex flex-col">
        <ChatWindow messages={messages} />
        <MessageInput onSubmit={handleSubmit} disabled={loading} />
      </div>
    </div>
  );
}
