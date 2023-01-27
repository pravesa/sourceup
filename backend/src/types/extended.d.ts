export {};

declare global {
  /**
   * Extending NodeJS.Process interface by typescript's declaration merging
   */
  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'test' | 'production';
      TZ: string;
      SESSION_SECRET: string;
      DB_URI: string;
      DB_NAME: string;
    }
  }

  // Extended Error type for express server default error handler
  interface ServerError extends Error {
    status: number;
  }
}

/**
 * Custom properties for session data
 */
declare module 'express-session' {
  interface SessionData {
    user: Omit<User, 'pwd'>;
  }
}
