"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UserApi } from '@/services/user-api';

interface ProfileData {
    email: string;
    profile?: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    };
}

interface UpdateProfileForm {
    firstName: string;
    lastName: string;
    phone: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const [message, setMessage] = useState<string>("");

    const fetchProfile = async (): Promise<ProfileData> => {
        if (!token) throw new Error("No access token");
        return UserApi.getProfile(token);
    };

    const { data: profile, isLoading, error } = useQuery<ProfileData>({
        queryKey: ["profile"],
        queryFn: fetchProfile,
        enabled: !!token,
    });

    const [form, setForm] = useState<UpdateProfileForm>({ firstName: "", lastName: "", phone: "" });
    useEffect(() => {
        if (profile && profile.profile) {
            setForm({
                firstName: profile.profile.firstName || "",
                lastName: profile.profile.lastName || "",
                phone: profile.profile.phone || "",
            });
        }
    }, [profile]);

    const mutation = useMutation(
        {
            mutationFn: (updatedData: UpdateProfileForm) => UserApi.updateProfile(updatedData, token as string),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["profile"] });
                setMessage("Profile updated successfully");
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

    if (!token) {
        router.push("/login");
        return null;
    }
    if (isLoading) return <p className="text-center">Loading profile...</p>;
    if (error instanceof Error) return <p className="text-center text-red-600">Error: {error.message}</p>;

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold mb-4">Profile</h1>
            <p className="mb-4"><span className="font-semibold">Email:</span> {profile?.email}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                />
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                />
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                />
                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" type="submit" disabled={mutation.isPending}>
                    Update Profile
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
}