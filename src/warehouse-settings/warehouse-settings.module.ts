import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { WarehouseSettingsController } from './warehouse-settings.controller';

import { WarehouseSettingsService } from './warehouse-settings.service';

@Module({
  imports: [DatabaseModule],

  controllers: [WarehouseSettingsController],

  providers: [WarehouseSettingsService],

  exports: [WarehouseSettingsService],
})
export class WarehouseSettingsModule {}
