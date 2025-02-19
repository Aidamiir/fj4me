import { Roles } from './auth.enums';

export interface IRegisterRequest {
    email: string;
    password: string;
    role: Roles;
}

export interface IConfirmRequest {
    token: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
}

export interface IResetRequest {
    email: string;
}

export interface IResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface IRefreshTokensResponse {
    accessToken: string;
}