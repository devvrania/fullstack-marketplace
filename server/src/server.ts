import { app } from './app';
import { env } from './config/env';
import { initDataSource } from './db/data-source';

async function main() {
  const ds = await initDataSource();
  // eslint-disable-next-line no-console
  console.log('DB initialized:', ds.isInitialized);
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', e);
  process.exit(1);
});