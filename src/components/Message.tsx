"use client";

import ReactMarkdown from "react-markdown";

interface MessageProps {
  type: "user" | "assistant" | "loading";
  content: string;
  videoTitle?: string;
}

export default function Message({ type, content, videoTitle }: MessageProps) {
  if (type === "loading") {
    return (
      <div className="flex gap-4 px-4 py-6 bg-dark-800">
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">YT</span>
        </div>
        <div className="flex items-center gap-2 text-dark-300">
          <div className="animate-spin w-4 h-4 border-2 border-dark-400 border-t-green-500 rounded-full" />
          <span>{content}</span>
        </div>
      </div>
    );
  }

  if (type === "user") {
    return (
      <div className="flex gap-4 px-4 py-6">
        <div className="w-8 h-8 rounded-full bg-dark-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">U</span>
        </div>
        <div className="text-dark-100 pt-1">
          <p className="text-white">{content}</p>
          {videoTitle && (
            <p className="text-dark-400 text-sm mt-1">{videoTitle}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 px-4 py-6 bg-dark-800">
      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-bold">YT</span>
      </div>
      <div className="markdown-content text-dark-100 pt-1 flex-1 min-w-0">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
