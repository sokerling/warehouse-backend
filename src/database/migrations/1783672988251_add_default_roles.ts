import type { Kysely } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db
    .insertInto('roles')
    .values([
      {
        id: crypto.randomUUID(),
        code: 'ADMIN',
      },
      {
        id: crypto.randomUUID(),
        code: 'ACCOUNTANT',
      },
      {
        id: crypto.randomUUID(),
        code: 'WAREHOUSE',
      },
    ])
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db
    .deleteFrom('roles')
    .where('code', 'in', ['ADMIN', 'ACCOUNTANT', 'WAREHOUSE'])
    .execute();
}
