import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResumeDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}