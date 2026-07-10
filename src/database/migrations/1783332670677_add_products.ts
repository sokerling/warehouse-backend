import type { Kysely } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('products')
    .addColumn('id', 'uuid', (c) => c.primaryKey())
    .addColumn('article', 'varchar', (c) => c.notNull().unique())
    .addColumn('name', 'varchar', (c) => c.notNull())
    .addColumn('description', 'text')
    .addColumn('created_at', 'timestamp', (c) => c.notNull())
    .addColumn('updated_at', 'timestamp', (c) => c.notNull())
    .execute();

  await db.schema
    .createTable('operation_types')
    .addColumn('id', 'uuid', (c) => c.primaryKey())
    .addColumn('code', 'varchar', (c) => c.notNull().unique())
    .execute();

  await db.schema
    .createTable('operations')
    .addColumn('id', 'uuid', (c) => c.primaryKey())
    .addColumn('product_id', 'uuid', (c) => c.notNull())
    .addColumn('user_id', 'uuid', (c) => c.notNull())
    .addColumn('operation_type_id', 'uuid', (c) => c.notNull())
    .addColumn('quantity', 'integer', (c) => c.notNull())
    .addColumn('operation_date', 'timestamp', (c) => c.notNull())
    .addColumn('created_at', 'timestamp', (c) => c.notNull())
    .addForeignKeyConstraint('ops_product_fk', ['product_id'], 'products', [
      'id',
    ])
    .addForeignKeyConstraint('ops_user_fk', ['user_id'], 'users', ['id'])
    .addForeignKeyConstraint(
      'ops_type_fk',
      ['operation_type_id'],
      'operation_types',
      ['id'],
    )
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('operations').execute();
  await db.schema.dropTable('operation_types').execute();
  await db.schema.dropTable('products').execute();
}
