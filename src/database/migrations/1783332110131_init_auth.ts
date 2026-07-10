import type { Kysely } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('roles')
    .addColumn('id', 'uuid', (c) => c.primaryKey())
    .addColumn('code', 'varchar', (c) => c.notNull().unique())
    .execute();

  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (c) => c.primaryKey())
    .addColumn('name', 'varchar', (c) => c.notNull())
    .addColumn('email', 'varchar', (c) => c.notNull().unique())
    .addColumn('password_hash', 'varchar', (c) => c.notNull())
    .addColumn('role_id', 'uuid', (c) => c.notNull())
    .addColumn('created_at', 'timestamp', (c) => c.notNull())
    .addColumn('updated_at', 'timestamp', (c) => c.notNull())
    .addForeignKeyConstraint('users_role_fk', ['role_id'], 'roles', ['id'])
    .execute();

  await db.schema
    .createTable('refresh_sessions')
    .addColumn('id', 'uuid', (c) => c.primaryKey())
    .addColumn('user_id', 'uuid', (c) => c.notNull())
    .addColumn('refresh_token_hash', 'varchar', (c) => c.notNull())
    .addColumn('expires_at', 'timestamp', (c) => c.notNull())
    .addColumn('created_at', 'timestamp', (c) => c.notNull())
    .addForeignKeyConstraint('refresh_user_fk', ['user_id'], 'users', ['id'])
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('refresh_sessions').execute();
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('roles').execute();
}
