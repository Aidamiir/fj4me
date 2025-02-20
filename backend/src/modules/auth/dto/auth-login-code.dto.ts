import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginCodeDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}