export interface IRegisterRequest {
    email: string;
    password: string;
}

export interface ILoginCodeRequest {
    email: string;
    password: string;
}

export interface IVerifyLoginCodeRequest {
    email: string;
    code: string;
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