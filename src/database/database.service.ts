import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import type { DB } from './database.generated.types';

import { DATABASE } from './database.constants';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DATABASE)
    readonly db: Kysely<DB>,
  ) {}
}
