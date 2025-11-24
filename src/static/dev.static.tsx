const env = import.meta.env;

const config = {
    development: {
        API_URL: env.ERK_API_URL_DEV,
        ENV_NAME: 'development',
    },
    preproduction: {
        API_URL: env.ERK_API_URL_PREPROD,
        ENV_NAME: 'preproduction',
    },
    production: {
        API_URL: env.ERK_API_URL_PROD,
        ENV_NAME: 'production',
    }
};


const getCurrentEnv = () => {
    return env.ERK_ENV_TYPE || 'production';
};

export const currentEnv = getCurrentEnv();

export const ERK_API_URL = config[currentEnv].API_URL;

export const IsInDevelopment = currentEnv === 'development';
export const IsInPreProd = currentEnv === 'preproduction';
export const IsInProduction = currentEnv === 'production';
