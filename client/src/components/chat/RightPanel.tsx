'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface RightPanelProps {
  showRightPanel: boolean;
  chatLog: Message[];
  loading: boolean;
  assistantEndRef: React.RefObject<HTMLDivElement>;
  rightPanelRef: React.RefObject<HTMLDivElement>;
}

export default function RightPanel({
  showRightPanel,
  chatLog,
  loading,
  assistantEndRef,
  rightPanelRef,
}: RightPanelProps) {
  if (!showRightPanel) return null;

  return (
    <div
      ref={rightPanelRef}
      className="w-full md:w-1/2 max-w-screen p-4 border-l border-black/50 overflow-y-auto bg-black text-white font-mono custom-scrollbar"
    >
      <div className="flex flex-col gap-3">
        {chatLog
          .filter((msg) => msg.role === 'assistant')
          .map((msg, idx) => (
            <div
              key={idx}
              className="w-full max-w-full overflow-hidden break-words whitespace-pre-wrap bg-white/10 text-green-300 p-3 rounded-md"
            >
              🤖 <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

        <div ref={assistantEndRef} />

        {loading && (
          <div className="flex items-center gap-2 text-white text-lg animate-pulse">
            <AiOutlineLoading3Quarters className="animate-spin" /> AI is thinking...
          </div>
        )}
      </div>
    </div>
  );
}
