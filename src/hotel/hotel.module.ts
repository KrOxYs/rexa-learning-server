import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  providers: [HotelService],
  exports: [HotelService],
  imports: [PrismaModule],
})
export class HotelModule {}
