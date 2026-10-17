import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './user/user.module';
import Joi from 'joi';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        REFRESH_SECRET: Joi.string().exist(),
        REFRESH_EXPIRATION: Joi.number().exist(),
        ACCESS_SECRET: Joi.string().exist(),
        ACCESS_EXPIRATION: Joi.number().exist(),
        PORT: Joi.number().default(3000),
        MODE: Joi.string().default('DEV'),
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
