import { Module } from '@nestjs/common';

import { MethodService } from './method.service';
@Module({
  providers: [MethodService],
  exports: [MethodService],
})
export class MethodModule {}
