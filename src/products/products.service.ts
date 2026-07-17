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

  async getBalance(id: string) {
    await this.findOne(id);

    const operations = await this.database.db
      .selectFrom('operations')
      .innerJoin(
        'operationTypes',
        'operationTypes.id',
        'operations.operationTypeId',
      )
      .select(['operationTypes.code', 'operations.quantity'])
      .where('operations.productId', '=', id)
      .execute();

    const balance = operations.reduce((sum, operation) => {
      if (operation.code === 'INCOME') {
        return sum + operation.quantity;
      }

      return sum - operation.quantity;
    }, 0);

    return {
      productId: id,
      balance,
    };
  }
}
