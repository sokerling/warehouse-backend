import type { Kysely } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db
    .insertInto('operation_types')
    .values([
      {
        id: crypto.randomUUID(),
        code: 'INCOME',
      },
      {
        id: crypto.randomUUID(),
        code: 'OUTCOME',
      },
    ])
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db
    .deleteFrom('operation_types')
    .where('code', 'in', ['INCOME', 'OUTCOME'])
    .execute();
}
