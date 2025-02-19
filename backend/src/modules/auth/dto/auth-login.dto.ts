import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
    @IsString()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}