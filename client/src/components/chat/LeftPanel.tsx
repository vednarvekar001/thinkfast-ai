'use client';

import React from 'react';
import { FaArrowUp } from 'react-icons/fa6';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface LeftPanelProps {
  userInput: string;
  setUserInput: (value: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  handleSend: () => void;
  loading: boolean;
  chatLog: Message[];
  showRightPanel: boolean;
  userEndRef: React.RefObject<HTMLDivElement>;
}

export default function LeftPanel({
  userInput,
  setUserInput,
  uploadedFile,
  setUploadedFile,
  handleSend,
  loading,
  chatLog,
  showRightPanel,
  userEndRef,
}: LeftPanelProps) {
  return (
    <div
      key={(chatLog?.length ?? 0)}
      className={`transition-all duration-500 ${showRightPanel ? 'w-1/2' : 'w-full'} p-4 relative`}
    >
      {/* File Preview */}
      {uploadedFile && (
        <div className="text-sm text-gray-300 text-center mb-2">
          📄 {uploadedFile.name}
          <button
            onClick={() => setUploadedFile(null)}
            className="ml-2 text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* User Messages */}
      <div className="h-full overflow-y-auto pr-2 pb-[160px] custom-scrollbar">
        <div className="flex flex-col gap-3">
          {(chatLog || [])
            .filter((msg) => msg.role === 'user')
            .map((msg, idx) => (
              <div
                key={idx}
                className="bg-white/10 text-white p-3 rounded-md font-mono text-left"
              >
                🧑‍💻 {msg.content}
              </div>
            ))}
          <div ref={userEndRef} />
        </div>
      </div>

      {/* Input Bar */}
       <div 
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 ${
          showRightPanel ? 'w-[85%]' : 'w-[50%]'
        } transition-all duration-500`}
      >
        <div className="flex items-center gap-2 bg-white/10 border-black rounded-4xl px-4 py-2">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask anything"
            className="flex-1 p-3 rounded bg-transparent text-white border-none resize-none h-20 focus:outline-none font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`bg-white text-black p-3 rounded-full hover:bg-gray-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
