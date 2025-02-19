import { IsEmail, IsNotEmpty, IsString, IsEnum, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class AuthRegisterDto {
    @IsEmail()
    public email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    public password: string;

    @IsEnum(Role)
    public role: Role;
}