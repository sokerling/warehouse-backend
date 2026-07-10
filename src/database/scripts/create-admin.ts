import 'dotenv/config';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

import type { DB } from '../database.generated.types';

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});

async function createAdmin() {
  const role = await db
    .selectFrom('roles')
    .selectAll()
    .where('code', '=', 'ADMIN')
    .executeTakeFirst();

  if (!role) {
    throw new Error('ADMIN role not found');
  }

  const existingUser = await db
    .selectFrom('users')
    .selectAll()
    .where('email', '=', 'admin@test.com')
    .executeTakeFirst();

  if (existingUser) {
    console.log('Admin already exists');
    return;
  }

  const passwordHash = await bcrypt.hash('admin123', 10);

  await db
    .insertInto('users')
    .values({
      id: crypto.randomUUID(),
      name: 'Admin',
      email: 'admin@test.com',
      passwordHash,
      roleId: role.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .execute();

  console.log('Admin created');
}

createAdmin()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
