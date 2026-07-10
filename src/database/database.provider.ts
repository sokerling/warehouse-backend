import { ConfigService } from '@nestjs/config';

import { DATABASE } from './database.constants';
import { createDatabase } from './database.factory';

export const databaseProvider = {
  provide: DATABASE,

  inject: [ConfigService],

  useFactory: (configService: ConfigService) => {
    return createDatabase(configService);
  },
};
