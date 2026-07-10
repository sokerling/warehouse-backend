import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserData } from './types/create-user-data';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findByEmail(email: string) {
    return this.database.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async create(data: CreateUserData) {
    return this.database.db
      .insertInto('users')
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: data.roleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findRoleByCode(code: string) {
    return this.database.db
      .selectFrom('roles')
      .selectAll()
      .where('code', '=', code)
      .executeTakeFirstOrThrow();
  }
}
