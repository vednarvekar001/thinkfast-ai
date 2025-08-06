'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ChatPanel from '@/components/chat/chatPanel';
import NavbarChat from '@/components/layout/Navbar';
// import { RefObject } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatIdFromURL = searchParams.get('id');

  const [userInput, setUserInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [extractedText, setExtractedText] = useState('');
  const [user, setUser] = useState<{profilePic?: string} | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8114/api/user/settings', {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setUser(data.user);
      } catch {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!chatIdFromURL) return;

    const loadChat = async () => {
      try {
        const res = await fetch(`http://localhost:8114/api/chat/${chatIdFromURL}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Chat load failed');
        setChatLog(data.chat.messages);
        setChatId(data.chat._id);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load chat');
      }
    };

    loadChat();
  }, [chatIdFromURL]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, loading]);

  const handleSend = async () => {
    if (!userInput.trim() && !uploadedFile && !extractedText.trim()) return;

    setLoading(true);
    
    const userMessage = {
      role: 'user',
      content: userInput.trim() || (uploadedFile ? `📄 ${uploadedFile.name}` : extractedText)
    };
    setChatLog(prev => [...prev, userMessage]);

    try {
      const payload = {
        prompt: userInput.trim() || extractedText,
        user: user?._id,
        chatId,
        extractedText,
        fileInfo: uploadedFile ? { name: uploadedFile.name } : null,
        conversationHistory: chatLog.slice(-4)
      };

      const res = await fetch('http://localhost:8114/api/chat/ask', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'AI response failed');

      setChatLog(prev => [...prev, { role: 'assistant', content: data.response }]);
      
      if (!chatId) {
        setChatId(data.chatId);
        router.push(`/chat?id=${data.chatId}`);
      }

      setUserInput('');
      setUploadedFile(null);
      setExtractedText('');
    } catch (err: any) {
      setChatLog(prev => prev.filter(msg => msg.role !== 'user' || msg.content !== userMessage.content));
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleExtractedText = (text: string) => {
    setExtractedText(text);
  };

   return (
    <div className="flex flex-col h-screen bg-black text-white">
      <NavbarChat user={user || {}} /> {/* Added null check */}
      
      <div className="flex flex-1 overflow-hidden">
        <ChatPanel
          user={user}
          userInput={userInput}
          setUserInput={setUserInput}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          handleSend={handleSend}
          loading={loading}
          chatLog={chatLog}
          messagesEndRef={messagesEndRef}
          onFileUpload={handleFileUpload}
          onExtractedText={handleExtractedText}
        />
      </div>
    </div>
  );
}