"use client";

import { useState } from "react";

interface MessageInputProps {
  onSubmit: (url: string, minutes: number) => void;
  disabled: boolean;
}

export default function MessageInput({ onSubmit, disabled }: MessageInputProps) {
  const [url, setUrl] = useState("");
  const [minutes, setMinutes] = useState(5);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || disabled) return;
    onSubmit(url.trim(), minutes);
    setUrl("");
  }

  return (
    <div className="border-t border-dark-700 bg-dark-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex items-center gap-3"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Pega una URL de YouTube..."
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-dark-400 transition-colors disabled:opacity-50"
        />

        <select
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          disabled={disabled}
          className="px-3 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-dark-400 transition-colors disabled:opacity-50"
        >
          <option value={5}>5 min</option>
          <option value={10}>10 min</option>
          <option value={15}>15 min</option>
        </select>

        <button
          type="submit"
          disabled={disabled || !url.trim()}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
