"use client";
import axios from "axios";
import { useState, useEffect, useRef, FormEvent } from "react";
import { useParams } from "next/navigation";
import type { RootState } from '../../../../../public/store'
import { useSelector } from 'react-redux'

interface Chat {
    id?: string;
    name_of_creator: string;
    message: string;
    room_id: string;
    createdAt?: Date;
}

export default function Chat() {
    const username = useSelector((state: RootState) => state.auth.username);
    const userId = useSelector((state: RootState) => state.auth.userId);
    const roomId = useParams().id as string;
    const wsRef = useRef<WebSocket | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [message, setMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Fetch existing chats
    useEffect(() => {
        const getChats = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/chatroom/${roomId}`);
                setChats(response.data);
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            }
        };
        getChats();
    }, [roomId]);

    // WebSocket connection
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log('Connected to chat server');
            ws.send(JSON.stringify({
                type: "join",
                username: username,
                userId: userId,
                payload: {
                    roomId: roomId
                }
            }));
        };

        

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        wsRef.current = ws;

        
    }, [roomId, userId, username]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !wsRef.current) return;

        wsRef.current.send(JSON.stringify({
            type: "chat",
            userId: userId,
            username: username,
            payload: {
                message: message,
            }
        }));
        wsRef.current.onmessage = (event) => {
            try {
                console.log(event.data)
                const newChat = JSON.parse(event.data);
                setChats(prevChats => [...prevChats, newChat]);
            } catch (error) {
                console.error('Failed to parse message:', event.data, error);
                // If the message is plain text, create a chat object
                if (typeof event.data === 'string') {
                    const textChat: Chat = {
                        name_of_creator: 'System',
                        message: event.data,
                        room_id: roomId,
                        createdAt: new Date()
                    };
                    setChats(prevChats => [...prevChats, textChat]);
                }
            }
        };
        setMessage('');
        return () => {
            wsRef.current?.close();
        };
        
    };

    return (
        <div className="flex flex-col h-screen max-h-screen">
            <div className="bg-gray-800 p-4 text-white">
                <h1 className="text-xl">Chat Room: {roomId}</h1>
                <p className="text-sm">Logged in as: {username}</p>
            </div>

            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {chats.map((chat, index) => (
                    <div 
                        key={chat.id || index}
                        className={`flex ${chat.name_of_creator === username ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] rounded-lg p-3 ${
                            chat.name_of_creator === username 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-800'
                        }`}>
                            <p className="text-sm font-semibold">{chat.name_of_creator}</p>
                            <p>{chat.message}</p>
                            <p className="text-xs opacity-70">
                                {new Date(chat.createdAt || '').toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <form 
                onSubmit={handleSubmit}
                className="border-t p-4 bg-white"
            >
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}