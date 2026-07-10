import { defineConfig } from 'kysely-ctl';
import { Pool } from 'pg';
import { PostgresDialect } from 'kysely';

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
    }),
  }),

  migrations: {
    migrationFolder: 'src/database/migrations',
  },
});
