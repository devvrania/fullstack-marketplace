import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { authRouter } from './routes/auth.routes';
import { clientCasesRouter } from './routes/case.routes';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.webOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(pinoHttp());

app.get('/health', (_req, res) => res.json({ ok: true }));

// TODO: mount routes here
app.use('/auth', authRouter);
app.use('/client', clientCasesRouter);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const code = err.status ?? 500;
  const msg = env.nodeEnv === 'production' ? 'Internal server error' : err.message ?? 'Error';
  if (_req.log) _req.log.error({ err }, 'request_error');
  res.status(code).json({ message: msg });
});
