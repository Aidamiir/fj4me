export interface RegisterData {
    email: string;
    password: string;
    role: "STUDENT" | "EMPLOYER";
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    // refresh token is set as an HTTP-only cookie
}

export class AuthApi {
    static async register({ email, password, role }: RegisterData): Promise<any> {
        const res = await fetch("http://localhost:4040/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Registration failed");
        }
        return res.json();
    }

    static async login({ email, password }: LoginData): Promise<LoginResponse> {
        const res = await fetch("http://localhost:4040/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // for httpOnly cookie (refresh token)
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Login failed");
        }
        return res.json();
    }
}