import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { authRouter } from './routes/auth.routes';
import { clientCasesRouter } from './routes/case.routes';
import { lawyerMarketplaceRouter } from './routes/lawyer.marketplace.routes';
import { lawyerQuotesRouter } from './routes/lawyer.quote.routes';
import { lawyerCasesRouter } from './routes/lawyer.case.routes';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.webOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(pinoHttp());

// Explicit root responder to avoid any edge cases around routing precedence
app.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/') {
    return res.json({
      message: 'Legal Marketplace API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        auth: '/auth/*',
        client: '/client/*',
        lawyer: '/lawyer/*',
      },
    });
  }
  return next();
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/test', (_req, res) => res.json({ ok: true, message: "Hello" }));

// TODO: mount routes here
app.use('/auth', authRouter);
app.use('/client', clientCasesRouter);

app.use('/lawyer', lawyerMarketplaceRouter);
app.use('/lawyer', lawyerQuotesRouter);
app.use('/lawyer', lawyerCasesRouter);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const code = err.status ?? 500;
  const msg = env.nodeEnv === 'production' ? 'Internal server error' : err.message ?? 'Error';
  if (_req.log) _req.log.error({ err }, 'request_error');
  res.status(code).json({ message: msg });
});
