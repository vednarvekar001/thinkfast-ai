'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import LeftPanel from '@/components/chat/LeftPanel';
import RightPanel from '@/components/chat/RightPanel';
import Navbar from '@/components/layout/Navbar';

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
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [extractedText, setExtractedText] = useState('');
  const [user, setUser] = useState<any>(null);

  const userEndRef = useRef<HTMLDivElement>(null);
  const assistantEndRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

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
        setShowRightPanel(true);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load chat');
      }
    };

    loadChat();
  }, [chatIdFromURL]);

  useEffect(() => {
    userEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog.length]);

  useEffect(() => {
    assistantEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [loading]);

  const handleSend = async () => {
    if (!userInput.trim() && !uploadedFile && !extractedText.trim()) return;

    setLoading(true);
    
    // Add user message to UI immediately
    const userMessage = {
      role: 'user' as const,
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

      // Add AI response to chat log
      setChatLog(prev => [...prev, { role: 'assistant', content: data.response }]);
      
      // Only update chatId if this was a new chat
      if (!chatId) {
        setChatId(data.chatId);
        setShowRightPanel(true);
        router.push(`/chat?id=${data.chatId}`);
      }

      setUserInput('');
      setUploadedFile(null);
      setExtractedText('');
    } catch (err: any) {
      // Remove the user message if there was an error
      setChatLog(prev => prev.filter(msg => msg.role !== 'user' || msg.content !== userMessage.content));
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Navbar
        user={user}
        onFileUpload={setUploadedFile}
        onExtractedText={setExtractedText}
        setChatLog={setChatLog}
        setChatId={setChatId}
        setShowRightPanel={setShowRightPanel}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          userInput={userInput}
          setUserInput={setUserInput}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          handleSend={handleSend}
          loading={loading}
          chatLog={chatLog}
          showRightPanel={showRightPanel}
          userEndRef={userEndRef}
        />
        <RightPanel
          showRightPanel={showRightPanel || loading}
          chatLog={chatLog}
          loading={loading}
          assistantEndRef={assistantEndRef}
          rightPanelRef={rightPanelRef}
        />
      </div>
    </div>
  );
}