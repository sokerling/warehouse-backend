import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { UpdateWarehouseSettingsDto } from './dto/update-warehouse-settings.dto';

@Injectable()
export class WarehouseSettingsService {
  constructor(private readonly database: DatabaseService) {}

  async get() {
    let settings = await this.database.db
      .selectFrom('warehouseSettings')
      .selectAll()
      .executeTakeFirst();

    if (!settings) {
      settings = await this.database.db
        .insertInto('warehouseSettings')
        .values({
          id: crypto.randomUUID(),
          capacity: 0,
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    return settings;
  }

  async update(data: UpdateWarehouseSettingsDto) {
    const settings = await this.get();

    return this.database.db
      .updateTable('warehouseSettings')
      .set({
        capacity: data.capacity,
        updatedAt: new Date(),
      })
      .where('id', '=', settings.id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
