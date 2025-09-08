import { Router } from 'express';
import { authService } from '../services/auth.service';
import { env } from '../config/env';
import {
  SignupClientSchema,
  SignupLawyerSchema,
  LoginSchema,
} from '../schemas/auth';

const router = Router();

function setAuthCookie(res: any, token: string) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
}

router.post('/signup/client', async (req, res, next) => {
  try {
    const body = SignupClientSchema.parse(req.body);
    const { user, token } = await authService.createUser({ role: 'client', ...body });
    setAuthCookie(res, token);
    res.status(201).json({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name ?? null,
    });
  } catch (e) {
    next(e);
  }
});

router.post('/signup/lawyer', async (req, res, next) => {
  try {
    const body = SignupLawyerSchema.parse(req.body);
    const { user, token } = await authService.createUser({ role: 'lawyer', ...body });
    setAuthCookie(res, token);
    res.status(201).json({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name ?? null,
      jurisdiction: user.jurisdiction ?? null,
      barNumber: user.barNumber ?? null,
    });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = LoginSchema.parse(req.body);
    const { user, token } = await authService.login(body);
    setAuthCookie(res, token);
    res.json({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name ?? null,
      jurisdiction: user.jurisdiction ?? null,
      barNumber: user.barNumber ?? null,
    });
  } catch (e) {
    next(e);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(env.cookieName, { httpOnly: true, sameSite: 'lax', secure: false }); // secure: true in prod
  res.json({ ok: true });
});

export { router as authRouter };
