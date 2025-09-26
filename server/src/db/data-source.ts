import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env';
import { User } from '../entities/user.entity';
import { Case } from '../entities/case.entity';
import { Quote } from '../entities/quote.entity';
import { CaseFile } from '../entities/caseFile.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.dbUrl,
  synchronize: false, // NEVER true in tests/submission; use migrations
  logging: false,
  entities: [User, Case, Quote, CaseFile],
  migrations: ['dist/db/migrations/*.js'],
});

let initializing: Promise<DataSource> | null = null;

export async function initDataSource(): Promise<DataSource> {
  if (AppDataSource.isInitialized) return AppDataSource;
  if (initializing) return initializing;

  initializing = AppDataSource.initialize()
    .then((ds) => {
      return ds;
    })
    .catch((err) => {
      initializing = null;
      throw err;
    });

  return initializing;
}
