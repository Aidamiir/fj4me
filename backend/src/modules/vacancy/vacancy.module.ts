import { Module } from '@nestjs/common';

import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';

@Module({
    providers: [VacancyService],
    controllers: [VacancyController],
})
export class VacancyModule {}