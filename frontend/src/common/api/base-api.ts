import { ApiService } from './api.service';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!baseUrl) throw new Error('NEXT_PUBLIC_API_BASE_URL обязателен');

export const baseApi = new ApiService(baseUrl);