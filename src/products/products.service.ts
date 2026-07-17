import { Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    return this.database.db.selectFrom('products').selectAll().execute();
  }

  async findOne(id: string) {
    const product = await this.database.db
      .selectFrom('products')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(data: CreateProductDto) {
    return this.database.db
      .insertInto('products')
      .values({
        id: crypto.randomUUID(),

        article: data.article,

        name: data.name,

        description: data.description ?? null,

        createdAt: new Date(),

        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(id: string, data: UpdateProductDto) {
    await this.findOne(id);

    return this.database.db
      .updateTable('products')
      .set({
        ...data,

        updatedAt: new Date(),
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.database.db
      .deleteFrom('products')
      .where('id', '=', id)
      .execute();

    return {
      message: 'Product deleted',
    };
  }
}
