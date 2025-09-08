import { AppDataSource } from '../db/data-source';
import { User } from '../entities/user.entity';
import argon2 from 'argon2';
import { signJwt } from '../utils/jwt';
import { CreateUserParams, LoginInput } from '../schemas/auth';

export const authService = {
  async createUser(params: CreateUserParams): Promise<{ user: User; token: string }> {
    const repo = AppDataSource.getRepository(User);

    const email = params.email.toLowerCase();
    const exists = await repo.findOne({ where: { email } });
    if (exists) {
      throw Object.assign(new Error('Email already in use'), { status: 400 });
    }

    const passwordHash = await argon2.hash(params.password, { type: argon2.argon2id });

    const u = repo.create({
      role: params.role,
      email,
      passwordHash,
      ...(params.name !== undefined ? { name: params.name } : {}),
      ...('jurisdiction' in params && params.jurisdiction !== undefined
        ? { jurisdiction: params.jurisdiction }
        : {}),
      ...('barNumber' in params && params.barNumber !== undefined
        ? { barNumber: params.barNumber }
        : {}),
    });

    const saved = await repo.save(u);
    const token = signJwt({ sub: saved.id, role: saved.role, email: saved.email });
    return { user: saved, token };
  },

  async login(params: LoginInput): Promise<{ user: User; token: string }> {
    const repo = AppDataSource.getRepository(User);
    const email = params.email.toLowerCase();

    const user = await repo.findOne({ where: { email } });
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const ok = await argon2.verify(user.passwordHash, params.password);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const token = signJwt({ sub: user.id, role: user.role, email: user.email });
    return { user, token };
  },
};
