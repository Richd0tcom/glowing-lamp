import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TransfersModule } from './core/transfers/transfers.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    TransfersModule,
    DbModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
