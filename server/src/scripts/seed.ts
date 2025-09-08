import 'dotenv/config';
import { initDataSource, AppDataSource } from '../db/data-source';
import { User } from '../entities/user.entity';
import argon2 from 'argon2';

async function main() {
  await initDataSource();
  const repo = AppDataSource.getRepository(User);

  const seeds = [
    { role: 'client', email: 'client1@example.com', password: 'Passw0rd!', name: 'Client One' },
    { role: 'lawyer', email: 'lawyer1@example.com', password: 'Passw0rd!', name: 'Lawyer One', jurisdiction: 'SG', barNumber: 'SG12345' },
  ] as const;

  for (const s of seeds) {
    const exists = await repo.findOne({ where: { email: s.email } });
    if (exists) continue;
    const passwordHash = await argon2.hash(s.password, { type: argon2.argon2id });
    const user = repo.create({
      role: s.role,
      email: s.email,
      passwordHash,
      name: s.name,
      jurisdiction: (s as any).jurisdiction,
      barNumber: (s as any).barNumber,
    });
    await repo.save(user);
    // eslint-disable-next-line no-console
    console.log('Seeded user:', s.email);
  }

  process.exit(0);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
