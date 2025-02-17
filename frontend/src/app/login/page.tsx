"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from '@/services/auth-api';

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [message, setMessage] = useState<string>("");

    const mutation = useMutation(
        {
            mutationFn: (loginData: LoginForm) => AuthApi.login(loginData),
            onSuccess: (data: { accessToken: string }) => {
                localStorage.setItem("accessToken", data.accessToken);
                router.push("/profile");
            },
            onError: (error: any) => setMessage(error.message),
        }
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full p-2 border rounded"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-2 border rounded"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" type="submit" disabled={mutation.isPending}>
                    Login
                </button>
            </form>
            {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
    );
}