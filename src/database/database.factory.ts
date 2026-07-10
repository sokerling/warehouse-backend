import { ConfigService } from '@nestjs/config';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { DB } from './database.generated.types';

export function createDatabase(configService: ConfigService): Kysely<DB> {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow('DB_PORT')),
        database: configService.getOrThrow<string>('DB_NAME'),
        user: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
      }),
    }),
    plugins: [new CamelCasePlugin()],
  });
}
