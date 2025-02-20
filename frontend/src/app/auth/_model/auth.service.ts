import type {
    ILoginCodeRequest,
    IVerifyLoginCodeRequest,
    ILoginResponse,
    IRegisterRequest,
    IResetPasswordRequest,
    IResetRequest,
} from './auth.interfaces';
import { API_MAP, baseApi } from '@/common/api';

export class AuthService {
    public static register(data: IRegisterRequest) {
        return baseApi.post<void>(API_MAP.AUTH.REGISTER, data);
    }

    public static requestLoginCode(data: ILoginCodeRequest): Promise<void> {
        return baseApi.post(API_MAP.AUTH.LOGIN_REQUEST_CODE, data) as Promise<void>;
    }

    public static verifyLoginCode(data: IVerifyLoginCodeRequest): Promise<ILoginResponse> {
        return baseApi.post(API_MAP.AUTH.LOGIN_VERIFY_CODE, data) as Promise<ILoginResponse>;
    }

    public static logout() {
        return baseApi.post(API_MAP.AUTH.LOGOUT) as Promise<void>;
    }

    public static logoutAll() {
        return baseApi.post(API_MAP.AUTH.LOGOUT_ALL) as Promise<void>;
    }

    public static requestReset(data: IResetRequest) {
        return baseApi.post(API_MAP.AUTH.REQUEST_RESET, data) as Promise<void>;
    }

    public static resetPassword(data: IResetPasswordRequest) {
        return baseApi.post(API_MAP.AUTH.RESET_PASSWORD, data) as Promise<void>;
    }
}