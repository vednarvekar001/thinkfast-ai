'use client';

import { default as Link } from 'next/link'; // Modified import
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { WiCloudy } from 'react-icons/wi';

interface Props {
  user: {
    profilePic?: string;
  };
}

export default function NavbarChat({ user }: Props) {
  const router = useRouter();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  
  

  const fetchChatHistory = async () => {
    try {
      const res = await fetch('http://localhost:8114/api/chat/history', {
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch history');

      setChatHistory(data.chats || []);
      setHistoryOpen(true);
    } catch (err: any) {
      toast.error(err.message || '❌ Failed to fetch history');
    }
  };

 const createNewChat = async () => {
  try {
    const res = await fetch('http://localhost:8114/api/chat/new', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create new chat');

    router.push(`/chat?id=${data.chatId}`);
    setHistoryOpen(false);
  } catch (err: any) {
    toast.error(err.message || 'Error creating chat');
  }
};


  return (
    <div className="flex items-center w-full bg-black/98 text-white p-3.5 h-[70px] relative">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/symbol.jpg" alt="Logo" height={70} width={70} className="rounded" />
        <h2 className="text-xl font-semibold font-mono">ThinkFast AI</h2>
      </div>

      <div className="text-lg flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="hover:text-gray-300 transition">
                 Home
            </Link>
            <Link href="/about" className="hover:text-gray-300 transition">
                 About
            </Link>
            <Link href="/chat" className="hover:text-gray-300 transition">
                Chat with AI
            </Link>
            <Link href="/login" className='hover:text-gray-300 transition'>
                Login/Register
            </Link>
        </div>

      

      {/* Right Side */}
      <div className="absolute right-5 flex items-center gap-3">
        <button onClick={fetchChatHistory} className="bg-white/10 hover:bg-white/30 p-2 rounded-full">
          <WiCloudy size={25} />
        </button>
        <Image
          src={user?.profilePic || '/default-avatar.png'}
          alt="Profile"
          width={40}
          height={40}
          onClick={() => router.push('/settings')}
          className="w-[40px] h-[40px] rounded-full object-cover cursor-pointer border-2 border-white hover:opacity-80 transition"
        />
      </div>

      {/* Chat History Dropdown */}
      {historyOpen && (
        <div className="absolute top-16 right-5 bg-black border border-white/20 rounded-md p-4 w-[300px] max-h-[400px] overflow-y-auto z-50 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">🕓 Chat History</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="text-white hover:text-red-400 text-lg"
              title="Close"
            >
              ❌
            </button>
          </div>

          <button
            onClick={createNewChat}
            className="w-full text-center bg-white/10 hover:bg-white/30 text-sm p-2 rounded mb-3 transition-all duration-200"
          >
            ➕ New Chat
          </button>

          {chatHistory.length === 0 ? (
            <p className="text-gray-400 text-sm">No chats found</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {chatHistory.map((chat) => (
                <li
                  key={chat._id}
                  onClick={() => {
                    setHistoryOpen(false);
                    router.push(`/chat?id=${chat._id}`);
                  }}
                  className="cursor-pointer hover:bg-white/10 p-2 rounded text-sm"
                >
                  🗂️ {chat.title || 'Untitled Chat'}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
