"use client";
import { useEffect, useState, ChangeEvent } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket;

interface ChatMessage {
    content: string;
    from: "self" | "other";
}

export default function ChatPage() {
    const [msgInput, setMsgInput] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    // Demo: текущий пользователь id = 1, получатель id = 2
    const userId = 1;
    const receiverId = 2;

    useEffect(() => {
        socket = io("http://localhost:4040", { query: { userId: userId.toString() } });

        socket.on("connect", () => {
            console.log("Connected to chat socket");
        });

        socket.on("messageSent", (msg: any) => {
            setChatMessages((prev) => [...prev, { ...msg, from: "self" }]);
        });

        socket.on("newMessage", (msg: any) => {
            setChatMessages((prev) => [...prev, { ...msg, from: "other" }]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (msgInput.trim()) {
            socket.emit("sendMessage", { senderId: userId, receiverId, content: msgInput });
            setMsgInput("");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold mb-4 text-center">Chat</h1>
            <div className="border p-4 h-64 overflow-y-auto mb-4">
                {chatMessages.map((msg, idx) => (
                    <div key={idx} className={msg.from === "self" ? "text-right" : "text-left"}>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    className="flex-1 p-2 border rounded"
                    type="text"
                    value={msgInput}
                    placeholder="Type a message..."
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMsgInput(e.target.value)}
                />
                <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}