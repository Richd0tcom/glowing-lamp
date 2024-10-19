import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dbSetup } from './db/setup';

async function bootstrap() {
  dbSetup();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
