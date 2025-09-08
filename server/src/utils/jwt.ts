import * as jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type JwtPayload = {
  sub: string;
  role: 'client' | 'lawyer';
  email: string;
};

export function signJwt(payload: JwtPayload, expiresIn: string | number = '1d') {
  return jwt.sign(
    payload,
    env.jwtSecret as jwt.Secret,
    { expiresIn } as jwt.SignOptions
  );
}

export function verifyJwt<T = JwtPayload>(token: string): T {
  return jwt.verify(token, env.jwtSecret as jwt.Secret) as T;
}
