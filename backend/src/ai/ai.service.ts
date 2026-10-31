import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  private readonly logger = new Logger(AiService.name);
  private readonly modelCascade = [
    'gemini-3.8-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
  ];
  constructor(private readonly confgService: ConfigService) {
    const apiKey = confgService.getOrThrow<string>('GEM_API_KEY');
    this.ai = new GoogleGenAI({ apiKey });
  }
  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    delay: number = 1500,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      console.log(`error in catch aiService: ${error}`);
      const isOverLoaded =
        error?.status === 503 || error?.message?.includes('high demand');

      if (retries > 0 && isOverLoaded) {
        this.logger.warn(
          `Gemini model overloaded (503). Retrying in ${delay}ms... (${retries} attempts left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.retryOperation(operation, retries - 1, delay * 2);
      }
      if (error?.status === 429) {
        this.logger.warn(
          `Gemini model rate limited or quota exceeded (429). Retrying in ${delay}ms... (${retries} attempts left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.retryOperation(operation, retries - 1, delay * 2);
      }
      if (retries < 0 && this.modelCascade.length > 0) {
        this.logger.log(
          `Switching to next model in cascade: ${this.modelCascade[0]}`,
        );
        this.modelCascade.shift();
        return this.retryOperation(operation, retries, delay);
      }
      throw new Error(error);
    }
  }
  async extractingInfoFromScreenshot(
    buffer: Buffer,
    mimetype: string = 'image/jpg',
  ) {
    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimetype,
      },
    };
    const prompt = `
    You are a job post parser. Extract the following fields from this
    job posting screenshot and return ONLY valid JSON, no markdown:
    {
    "company": "string or null",
    "title": "string or null",
    "summary": "clear and detailled description of the job posting as string",
    "phone": "string or null",
    "companyEmail": "string or null",
    "postedAt": "ISO date string or null",
    "website": "string or null",
    "role": "string or null",
    "location": "string or null",
    "salaryMin": "number or null",
    "salaryMax": "number or null",
    "jobType": "FULL_TIME|PART_TIME|CONTRACT|INTERNSHIP|REMOTE|HYBRID|UNKNOWN",
    "deadline": "ISO date string or null",
    "requirements": ["array of skills/requirements strings"],
    "sourceBoard": "linkedin|indeed|glassdoor|other|unknown"
    }
    If a field is not visible in the screenshot, return null for that field.`;
    return this.retryOperation(async () => {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [imagePart, { text: prompt }],
      });
      return response.text || {};
    });
  }
}
