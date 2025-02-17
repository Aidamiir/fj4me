export interface ProfileData {
    email: string;
    profile?: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    };
}

export interface UpdateProfileData {
    firstName: string;
    lastName: string;
    phone: string;
}

export class UserApi {
    static async getProfile(accessToken: string): Promise<ProfileData> {
        const res = await fetch("http://localhost:4040/users/profile", {
            headers: { Authorization: "Bearer " + accessToken },
        });
        if (!res.ok) {
            throw new Error("Failed to fetch profile");
        }
        return res.json();
    }

    static async updateProfile(data: UpdateProfileData, accessToken: string): Promise<ProfileData> {
        const res = await fetch("http://localhost:4040/users/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Profile update failed");
        }
        return res.json();
    }
}