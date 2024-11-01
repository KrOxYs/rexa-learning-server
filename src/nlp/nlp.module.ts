import { Module } from '@nestjs/common';
import { NlpController } from './nlp.controller';
import { NlpService } from './nlp.service';

@Module({
  controllers: [NlpController],
  providers: [NlpService],
  exports: [NlpService],
})
export class NlpModule {}
