import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { WarehouseSettingsService } from './warehouse-settings.service';
import { UpdateWarehouseSettingsDto } from './dto/update-warehouse-settings.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('warehouse-settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehouseSettingsController {
  constructor(
    private readonly warehouseSettingsService: WarehouseSettingsService,
  ) {}

  @Get()
  get() {
    return this.warehouseSettingsService.get();
  }

  @Patch()
  @Roles('ADMIN')
  update(@Body() data: UpdateWarehouseSettingsDto) {
    return this.warehouseSettingsService.update(data);
  }
}
