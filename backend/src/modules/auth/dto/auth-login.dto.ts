import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
    @IsEmail()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}