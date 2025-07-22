declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    DB_HOST: string;
    DB_USER: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_PORT: string;
  }
}