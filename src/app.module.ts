import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
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
