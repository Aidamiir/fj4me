import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateApplicationDto {
    @IsNotEmpty()
    @IsNumber()
    resumeId: number;

    @IsNotEmpty()
    @IsNumber()
    vacancyId: number;
}