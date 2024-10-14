import { Body, Controller, Post } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('api')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('recommend')
  async recommend(@Body('input') input: string) {
    return this.recommendationService.getRecommendation(input);
  }
}
