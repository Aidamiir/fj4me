"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket;

interface Notification {
    content: string;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    // Demo: userId = 1
    const userId = 1;

    useEffect(() => {
        socket = io("http://localhost:4040", { query: { userId: userId.toString() } });

        socket.on("connect", () => {
            console.log("Connected to notifications socket");
        });

        socket.on("newNotification", (notif: any) => {
            setNotifications((prev) => [notif, ...prev]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold mb-4">Notifications</h1>
            {notifications.length === 0 ? (
                <p className="text-gray-600">No notifications yet.</p>
            ) : (
                <ul className="space-y-2">
                    {notifications.map((notif, idx) => (
                        <li key={idx} className="border p-2 rounded">
                            {notif.content} — {new Date(notif.createdAt).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}