"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from '@/services/auth-api';

interface RegisterForm {
    email: string;
    password: string;
    role: "STUDENT" | "EMPLOYER";
}

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState<RegisterForm>({ email: "", password: "", role: "STUDENT" });
    const [message, setMessage] = useState<string>("");

    const mutation = useMutation(
        {
            mutationFn: (newUser: RegisterForm) => AuthApi.register(newUser),
            onSuccess: () => {
                setMessage("Registration successful!");
                router.push("/login");
            },
            onError: (error: any) => setMessage(error.message),
        }
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold mb-4">Register</h1>
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
                <select
                    className="w-full p-2 border rounded"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="STUDENT">Student</option>
                    <option value="EMPLOYER">Employer</option>
                </select>
                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" type="submit" disabled={mutation.isPending}>
                    Register
                </button>
            </form>
            {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
    );
}