import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelModule } from './hotel/hotel.module';
import { PrismaModule } from './prisma/prisma.module';
import { NlpModule } from './nlp/nlp.module';
import { DestinationsService } from './destinations/destinations.service';
import { DestinationsModule } from './destinations/destinations.module';
import { RecommendationModule } from './recommendation/recommendation.module';

@Module({
  imports: [HotelModule, PrismaModule, NlpModule, DestinationsModule, RecommendationModule],
  controllers: [AppController],
  providers: [AppService, DestinationsService],
})
export class AppModule {}
