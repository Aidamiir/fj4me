import type {
    IConfirmRequest,
    ILoginRequest,
    ILoginResponse,
    IRegisterRequest,
    IResetPasswordRequest,
    IResetRequest,
} from './auth.interfaces';
import { baseApi } from '@/common/api/base-api';
import { API_MAP } from '@/common/api/api-map';
import type { ApiResponse } from '@/common/api/api.interfaces';

export class AuthService {
    public static register(data: IRegisterRequest) {
        return baseApi.post<void>(API_MAP.AUTH.REGISTER, data);
    }

    public static confirm(data: IConfirmRequest) {
        return baseApi.post<void>(API_MAP.AUTH.CONFIRM, data);
    }

    public static login(data: ILoginRequest) {
        return baseApi.post<ILoginResponse>(API_MAP.AUTH.LOGIN, data);
    }

    public static refresh() {
        return baseApi.post(API_MAP.AUTH.REFRESH) as Promise<
            ApiResponse<{ token: string; refreshToken: string }>
        >;
    }

    public static logout() {
        return baseApi.post(API_MAP.AUTH.LOGOUT) as Promise<ApiResponse<void>>;
    }

    public static logoutAll() {
        return baseApi.post(API_MAP.AUTH.LOGOUT_ALL) as Promise<ApiResponse<void>>;
    }

    public static requestReset(data: IResetRequest) {
        return baseApi.post(API_MAP.AUTH.REQUEST_RESET, data) as Promise<ApiResponse<void>>;
    }

    public static resetPassword(data: IResetPasswordRequest) {
        return baseApi.post(API_MAP.AUTH.RESET_PASSWORD, data) as Promise<ApiResponse<void>>;
    }
}