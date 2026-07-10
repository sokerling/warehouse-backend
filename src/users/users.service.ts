import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { DatabaseService } from '../database/database.service';

import { CreateUserData } from './types/create-user-data';
import { CreateUserDto } from './dto/create-user.dto';

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

  async findRoleById(id: string) {
    return this.database.db
      .selectFrom('roles')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async createByAdmin(data: CreateUserDto) {
    const existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const role = await this.findRoleByCode(data.role);

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.create({
      name: data.name,
      email: data.email,
      passwordHash,
      roleId: role.id,
    });

    const result = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return result;
  }
}
