export interface ApiResponse<T = null> {
    success: boolean;
    data: T | null;
    message: string;
}
