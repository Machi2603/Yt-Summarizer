"use client";

import { useRouter } from "next/navigation";

interface HistoryItem {
  id: string;
  videoTitle: string;
  minutes: number;
  createdAt: string;
  content: string;
  videoUrl: string;
}

interface SidebarProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onNewChat: () => void;
  username: string;
}

export default function Sidebar({
  history,
  onSelectItem,
  onNewChat,
  username,
}: SidebarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="w-64 bg-dark-950 flex flex-col h-full border-r border-dark-700">
      {/* Header */}
      <div className="p-4 border-b border-dark-700">
        <h1 className="text-lg font-bold text-white mb-3">YT Summarizer</h1>
        <button
          onClick={onNewChat}
          className="w-full px-4 py-2 border border-dark-600 rounded-lg text-dark-200 hover:bg-dark-800 transition-colors text-sm"
        >
          + Nuevo resumen
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto p-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-dark-300 hover:bg-dark-800 transition-colors mb-1 truncate"
            title={item.videoTitle}
          >
            {item.videoTitle}
          </button>
        ))}
        {history.length === 0 && (
          <p className="text-dark-600 text-sm text-center mt-4">
            Sin resúmenes aún
          </p>
        )}
      </div>

      {/* User menu */}
      <div className="p-3 border-t border-dark-700 space-y-2">
        <button
          onClick={() => router.push("/settings")}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-dark-300 hover:bg-dark-800 transition-colors"
        >
          Configuración
        </button>
        <div className="flex items-center justify-between px-3">
          <span className="text-sm text-dark-400 truncate">{username}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-dark-500 hover:text-red-400 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
