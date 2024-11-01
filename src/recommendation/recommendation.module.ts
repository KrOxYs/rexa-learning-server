import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecommendationController } from './recommendation.controller';
import { HotelModule } from 'src/hotel/hotel.module';
import { DestinationsModule } from 'src/destinations/destinations.module';
import { NlpModule } from 'src/nlp/nlp.module';
import { MethodModule } from 'src/utils/method.module';
@Module({
  providers: [RecommendationService],
  imports: [
    PrismaModule,
    HotelModule,
    DestinationsModule,
    NlpModule,
    MethodModule,
  ],
  exports: [RecommendationService],
  controllers: [RecommendationController],
})
export class RecommendationModule {}
