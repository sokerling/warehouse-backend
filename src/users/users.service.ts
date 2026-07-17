import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findAll() {
    return this.database.db
      .selectFrom('users')
      .select(['id', 'name', 'email', 'roleId', 'createdAt', 'updatedAt'])
      .execute();
  }

  async findOne(id: string) {
    const user = await this.database.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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

  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id);

    const values: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.name) {
      values.name = data.name;
    }

    if (data.email) {
      values.email = data.email;
    }

    if (data.password) {
      values.passwordHash = await bcrypt.hash(data.password, 10);
    }

    if (data.role) {
      const role = await this.findRoleByCode(data.role);

      values.roleId = role.id;
    }

    return this.database.db
      .updateTable('users')
      .set(values)
      .where('id', '=', id)
      .returning(['id', 'name', 'email', 'roleId', 'createdAt', 'updatedAt'])
      .executeTakeFirstOrThrow();
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.database.db.deleteFrom('users').where('id', '=', id).execute();

    return {
      message: 'User deleted',
    };
  }
}
