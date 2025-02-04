export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: "test" | "dev" | "prod",
      APP_URL: string;
      PORT: string;
      APP_SECRET: string;
      MONGOOSE_URL: string;
      APP_MAX_UPLOAD_LIMIT: string;
      APP_MAX_PARAMETER_LIMIT: string;
      APP_NAME: string;
      COMPANY_NAME: string;
      CORS_ENABLED: string;
      JWT_EXPIRES_IN: string;
      API_PREFIX: string;
      LOG_DAYS: string;
      COMMON_RATE_LIMIT_MAX_REQUESTS: string;
      COMMON_RATE_LIMIT_WINDOW_MS: string;
    }
  }
}