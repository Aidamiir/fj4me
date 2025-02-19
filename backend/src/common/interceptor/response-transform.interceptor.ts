import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * Глобальный interceptor для преобразования всех ответов в единый формат.
 */
@Injectable()
export class ResponseTransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {
    public intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map(data => ({
                success: true,
                data,
                message: '',
            })),
        );
    }
}