import { Module } from '@nestjs/common';
import { ExtractService } from './extract.service';
import { ExtractController } from './extract.controller';
import { AiService } from 'src/ai/ai.service';

@Module({
  controllers: [ExtractController],
  providers: [ExtractService, AiService],
})
export class ExtractModule {}
