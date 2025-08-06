'use client';

import { useEffect, useRef } from 'react';
import { FaArrowUp, FaPaperclip } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { WiCloudUp } from 'react-icons/wi';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

interface ChatPanelProps {
  onFileUpload: (file: File) => void;
  onExtractedText: (text: string) => void;
  user: {
    profilePic?: string;
  };
  userInput: string;
  setUserInput: (value: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  handleSend: () => void;
  loading: boolean;
  chatLog: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function ChatPanel({
  onFileUpload,
  onExtractedText,
  userInput,
  setUserInput,
  uploadedFile,
  setUploadedFile,
  handleSend,
  loading,
  chatLog,
  messagesEndRef,
}: ChatPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleUploadClick = () => fileInputRef.current?.click();
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('📥 Incoming chat upload');
    
    if (!file) return;

    onFileUpload(file);
    const formData = new FormData();
    formData.append('file', file);

    try {
      toast.info('Uploading...');
      const res = await fetch('http://localhost:8114/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await res.json();
      toast.success('✅ Upload successful!');
      if (onExtractedText && data.extractedText) {
        onExtractedText(data.extractedText);
      }
    } catch (err) {
      toast.error('❌ Upload failed');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full text-white font-mono">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatLog.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] lg:max-w-[60%] rounded-lg px-4 py-2 mx-3 ${
                  isUser
                    ? 'bg-white/10 text-white rounded-br-none'
                    : 'bg-white/10 text-green-300 rounded-bl-none'
                }`}
              >
                <div className="font-semibold mb-1">{isUser ? 'You' : 'Bolt AI'}</div>

                {msg.role === 'assistant' ? (
                  <div className="[&>div>p]:my-2 [&>div>ul]:my-2 [&>div>ol]:my-2 [&>div>li]:my-1">
                    <ReactMarkdown
                      components={{
                        ol: ({node, ...props}) => (
                          <ol className="my-3 pl-5 list-decimal" {...props} />
                        ),
                        li: ({node, ...props}) => (
                          <li className="mb-1.5 [&>p]:inline" {...props} />
                        ),
                        p: ({node, ...props}) => (
                          <p className="my-2.5" {...props} />
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}

                {uploadedFile && isUser && (
                  <div className="text-xs mt-1 flex items-center">
                    <FaPaperclip className="mr-1" />
                    {uploadedFile.name}
                  </div>
                )}

                {msg.timestamp && (
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 text-green-300 text-sm">
              <AiOutlineLoading3Quarters className="animate-spin" />
              <span>Bolt is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & File */}
      <div className="p-4 border-t border-gray-800">
        {uploadedFile && (
          <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2 mb-2 max-w-4xl mx-auto">
            <div className="flex items-center">
              <FaPaperclip className="mr-2" />
              <span className="text-sm truncate max-w-xs">{uploadedFile.name}</span>
            </div>
            <button 
              onClick={() => setUploadedFile(null)} 
              className="text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex gap-2 max-w-4xl mx-auto">
          <button
            onClick={handleUploadClick}
            className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
            title="Upload file"
          >
            <WiCloudUp size={20} />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </button>

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your thought..."
            className="flex-1 bg-white/7 text-white rounded-lg py-2 px-4 border border-gray-900 focus:outline-none resize-none max-h-32"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || (!userInput.trim() && !uploadedFile)}
            className={`p-3 rounded-lg transition text-white ${
              loading || (!userInput.trim() && !uploadedFile)
                ? 'bg-white/20 opacity-50 cursor-not-allowed'
                : 'bg-white/9 hover:bg-white/50'
            }`}
          >
            <FaArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}