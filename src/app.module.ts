import { Module } from '@nestjs/common';

import { LoggerModule } from 'nestjs-pino';

import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OperationsModule } from './operations/operations.module';
import { WarehouseSettingsModule } from './warehouse-settings/warehouse-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      },
    }),

    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OperationsModule,
    WarehouseSettingsModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
