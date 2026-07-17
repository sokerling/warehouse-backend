import { Injectable, BadRequestException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateOperationDto } from './dto/create-operation.dto';

@Injectable()
export class OperationsService {
  constructor(private readonly database: DatabaseService) {}

  async create(
    data: CreateOperationDto,
    userId: string,
    type: 'INCOME' | 'OUTCOME',
  ) {
    const product = await this.database.db
      .selectFrom('products')
      .selectAll()
      .where('id', '=', data.productId)
      .executeTakeFirst();

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (type === 'OUTCOME') {
      const balance = await this.getBalance(data.productId);

      if (balance < data.quantity) {
        throw new BadRequestException('Not enough products');
      }
    }

    const operationType = await this.database.db
      .selectFrom('operationTypes')
      .selectAll()
      .where('code', '=', type)
      .executeTakeFirstOrThrow();

    return this.database.db
      .insertInto('operations')
      .values({
        id: crypto.randomUUID(),

        productId: data.productId,

        userId,

        operationTypeId: operationType.id,

        quantity: data.quantity,

        operationDate: new Date(data.operationDate),

        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getBalance(productId: string) {
    const operations = await this.database.db
      .selectFrom('operations')
      .innerJoin(
        'operationTypes',
        'operationTypes.id',
        'operations.operationTypeId',
      )
      .select(['operationTypes.code', 'operations.quantity'])
      .where('productId', '=', productId)
      .execute();

    return operations.reduce((sum, operation) => {
      if (operation.code === 'INCOME') {
        return sum + operation.quantity;
      }

      return sum - operation.quantity;
    }, 0);
  }

  async findAll() {
    return this.database.db.selectFrom('operations').selectAll().execute();
  }
}
