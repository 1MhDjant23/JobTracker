import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const Port = config.get<number>('PORT') ?? 3000;
  console.log('Port', Port);
  await app.listen(Port, () => console.log(`App running on port ${Port}`));
}
bootstrap();
