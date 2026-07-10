import type { Kysely } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('warehouse_settings')
    .addColumn('id', 'uuid', (c) => c.primaryKey())
    .addColumn('capacity', 'integer', (c) => c.notNull())
    .addColumn('updated_at', 'timestamp', (c) => c.notNull())
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('warehouse_settings').execute();
}
