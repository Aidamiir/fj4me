import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MESSAGES } from '../constants/messages';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    public catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorMessage: string;

        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            if (typeof res === 'string') {
                errorMessage = res;
            }
            else if (typeof res === 'object' && res !== null && 'message' in res) {
                errorMessage = (res as { message: string }).message;
            }
            else {
                errorMessage = exception.message;
            }
        }
        else if (exception instanceof Error) {
            errorMessage = exception.message;
        }
        else {
            errorMessage = MESSAGES.INTERNAL_SERVER_ERROR;
        }

        this.logger.error(`Ошибка: ${errorMessage}`);

        response.status(status).json({
            success: false,
            data: null,
            message: errorMessage,
        });
    }
}