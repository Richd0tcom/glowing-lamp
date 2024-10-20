import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TransfersModule } from './core/transfers/transfers.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './core/user/user.module';
import { JoiPipeModule } from 'nestjs-joi';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async() => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        }) as unknown as CacheStore,
        ttl: 3 * 60000,

      })
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
