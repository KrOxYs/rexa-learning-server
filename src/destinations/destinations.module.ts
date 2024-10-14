import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DestinationsService } from './destinations.service';
@Module({
  providers: [DestinationsService],
  imports: [PrismaModule],
  exports: [DestinationsService],
})
export class DestinationsModule {}
