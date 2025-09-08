import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import { env } from '../config/env';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const raw = req.cookies?.[env.cookieName];
  if (!raw) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = verifyJwt(raw);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export function requireRole(role: 'client' | 'lawyer') {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    return next();
  };
}
