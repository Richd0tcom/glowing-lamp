import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TransfersModule } from './core/transfers/transfers.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './core/user/user.module';
import { JoiPipeModule } from 'nestjs-joi';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    JoiPipeModule,
    UserModule,
    TransfersModule,
    DbModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
