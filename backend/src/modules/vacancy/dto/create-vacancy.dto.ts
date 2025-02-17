import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVacancyDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}