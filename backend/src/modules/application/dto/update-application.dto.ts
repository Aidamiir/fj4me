import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateApplicationDto {
    @IsNotEmpty()
    @IsString()
    status: string;
}