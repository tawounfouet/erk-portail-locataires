const env = import.meta.env as Record<string, string | undefined>;

type ErkEnv = 'development' | 'preproduction' | 'production';

const normalizeEnv = (value: unknown): ErkEnv => {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'development' || normalized === 'preproduction' || normalized === 'production') {
    return normalized;
  }
  return 'production';
};

const readUrl = (...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) return value;
  }
  return undefined;
};

export const currentEnv: ErkEnv = normalizeEnv(env.ERK_ENV_TYPE ?? env.VITE_ERK_ENV_TYPE ?? env.MODE);

const config: Record<ErkEnv, { API_URL: string; ENV_NAME: ErkEnv }> = {
  development: {
    API_URL: readUrl('ERK_API_URL_DEV', 'VITE_API_BASE_URL') ?? 'http://127.0.0.1:8000',
    ENV_NAME: 'development',
  },
  preproduction: {
    API_URL: readUrl('ERK_API_URL_PREPROD', 'VITE_API_BASE_URL') ?? 'https://api.stg.eureka-residences.com',
    ENV_NAME: 'preproduction',
  },
  production: {
    API_URL: readUrl('ERK_API_URL_PROD', 'VITE_API_BASE_URL') ?? 'https://api.eureka-residences.com',
    ENV_NAME: 'production',
  },
};

export const ERK_API_URL = config[currentEnv].API_URL;

export const IsInDevelopment = currentEnv === 'development';
export const IsInPreProd = currentEnv === 'preproduction';
export const IsInProduction = currentEnv === 'production';
