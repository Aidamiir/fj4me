import type { IRefreshTokensResponse } from '@/app/auth/_model/auth.interfaces';
import type { ApiResponse } from './api.interfaces';
import { API_MAP } from './api-map';
import { CLIENT_MAP } from '@/common/constants';

export class ApiService {
    private readonly baseUrl: string;
    private readonly unauthorizedUrl?: string;

    constructor(baseUrl: string, unauthorizedUrl?: string) {
        this.baseUrl = baseUrl;
        this.unauthorizedUrl = unauthorizedUrl;
    }

    private async logout() {
        try {
            await fetch(this.baseUrl + API_MAP.AUTH.LOGOUT, { method: 'POST', credentials: 'include' });
        }
        catch (error) {
            console.error(error);
        }
        finally {
            window.location.href = CLIENT_MAP.AUTH.LOGIN;
        }
    }

    private async handleUnauthorized() {
        const url = (this.unauthorizedUrl ?? this.baseUrl) + API_MAP.AUTH.REFRESH;

        const response = await fetch(url, { credentials: 'include', method: 'POST' });

        if (response.status === 401) {
            await this.logout();
            throw new Error(response.statusText);
        }

        const json = await response.json() as ApiResponse<IRefreshTokensResponse>;

        if (!json.success || !json.data || !json.data.accessToken) {
            await this.logout();
            throw new Error(json.message);
        }

        return json.data;
    }

    private async fetchWithRetry<TResponse>(url: string, options?: RequestInit, retryCount = 3): Promise<TResponse> {
        const fullUrl = this.baseUrl + url;
        let response: Response;

        try {
            response = await fetch(fullUrl, {
                credentials: 'include',
                ...options,
                headers: this.mergeHeaders(options?.headers),
            });
        }
        catch (error) {
            console.error('Ошибка сети:', error);
            throw new Error('Нет интернет-соединения или сервер недоступен');
        }

        if (response.status === 401 && retryCount > 0) {
            const { accessToken } = await this.handleUnauthorized();
            options = this.updateAuthorizationHeader(options, accessToken);
            return await this.fetchWithRetry(url, options, retryCount - 1);
        }

        const json = await response.json() as ApiResponse<TResponse>;

        if (!json.success) {
            console.error(json.message ?? `HTTP ERROR! Status: ${response.status}`);
            throw new Error(json.message ?? `HTTP ERROR! Status: ${response.status}`);
        }

        return json.data as TResponse;
    }

    private mergeHeaders(headers?: HeadersInit): HeadersInit {
        let headerObj: Record<string, string> = {};

        if (headers instanceof Headers) {
            headers.forEach((value, key) => {
                headerObj[key] = value;
            });
        }
        else if (typeof headers === 'object') {
            headerObj = { ...headers } as Record<string, string>;
        }

        const token = localStorage.getItem('accessToken');
        if (token && !headerObj['Authorization'] && !headerObj['authorization']) {
            headerObj['Authorization'] = `Bearer ${token}`;
        }

        if (!headerObj['Content-Type'] && !headerObj['content-type']) {
            headerObj['Content-Type'] = 'application/json';
        }

        return headerObj;
    }

    private updateAuthorizationHeader(options?: RequestInit, accessToken?: string): RequestInit {
        const updatedHeaders = {
            ...(options?.headers || {}),
            Authorization: `Bearer ${accessToken}`,
        };

        return { ...options, headers: updatedHeaders };
    }

    public get<TResponse>(url: string, options?: RequestInit): Promise<TResponse> {
        return this.fetchWithRetry<TResponse>(url, { ...options, method: 'GET' });
    }

    public post<TResponse>(url: string, body?: unknown, options?: RequestInit): Promise<TResponse> {
        return this.fetchWithRetry<TResponse>(url, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    public put<TResponse>(url: string, body: unknown, options?: RequestInit): Promise<TResponse> {
        return this.fetchWithRetry<TResponse>(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    public delete<TResponse>(url: string, body?: unknown, options?: RequestInit): Promise<TResponse> {
        return this.fetchWithRetry<TResponse>(url, {
            ...options,
            method: 'DELETE',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
}
