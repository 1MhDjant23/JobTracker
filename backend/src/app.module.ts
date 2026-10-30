import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './user/user.module';
import Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { ExtractModule } from './extract/extract.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        REFRESH_SECRET: Joi.string().exist(),
        REFRESH_EXPIRATION: Joi.number().exist(),
        ACCESS_SECRET: Joi.string().exist(),
        ACCESS_EXPIRATION: Joi.number().exist(),
        PORT: Joi.number().exist(),
        MODE: Joi.string().default('DEV'),
        GEM_API_KEY: Joi.string(),
      }),
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ExtractModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
