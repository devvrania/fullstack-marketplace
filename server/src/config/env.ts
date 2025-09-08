import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  webOrigin: required('WEB_ORIGIN'),
  jwtSecret: required('JWT_SECRET'),
  dbUrl: required('DB_URL'),
  cookieName: required('COOKIE_NAME'),
};
