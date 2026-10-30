import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ExtractService } from './extract.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import multerOptions from 'src/config/multer.opts';
import { AiService } from 'src/ai/ai.service';

@Controller('extract')
export class ExtractController {
  constructor(
    private readonly extractService: ExtractService,
    private readonly aiService: AiService,
  ) {}
  @Post()
  @UseInterceptors(FilesInterceptor('screenshot', 3, multerOptions))
  upload(@UploadedFiles() screenshots: Express.Multer.File[]) {
    if (!screenshots || screenshots.length === 0) {
      throw new BadRequestException('At least one image must be uploaded.');
    }
    return this.aiService.extractingInfoFromScreenshot(
      screenshots[0].buffer,
      screenshots[0].mimetype,
    );
  }
}
