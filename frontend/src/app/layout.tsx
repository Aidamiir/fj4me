"use client";
import Link from "next/link";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <head>
            <title>Job Platform</title>
        </head>
        <body className="bg-gray-100 min-h-screen">
        <nav className="bg-white shadow p-4">
            <ul className="flex gap-4 justify-center">
                <li><Link className="text-blue-600 hover:underline" href="/">Home</Link></li>
                <li><Link className="text-blue-600 hover:underline" href="/register">Register</Link></li>
                <li><Link className="text-blue-600 hover:underline" href="/login">Login</Link></li>
                <li><Link className="text-blue-600 hover:underline" href="/profile">Profile</Link></li>
                <li><Link className="text-blue-600 hover:underline" href="/chat">Chat</Link></li>
                <li><Link className="text-blue-600 hover:underline" href="/notifications">Notifications</Link></li>
            </ul>
        </nav>
        <QueryClientProvider client={queryClient}>
            <main className="container mx-auto p-4">{children}</main>
        </QueryClientProvider>
        </body>
        </html>
    );
}