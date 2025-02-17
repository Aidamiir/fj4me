import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class AuthRegisterDto {
    @IsEmail()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;

    @IsIn(['STUDENT', 'EMPLOYER'])
    public role: 'STUDENT' | 'EMPLOYER';
}