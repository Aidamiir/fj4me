import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';

@Module({
    imports: [PrismaModule],
    providers: [ApplicationService],
    controllers: [ApplicationController],
})
export class ApplicationModule {}