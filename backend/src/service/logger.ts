import path from 'path';
import {pino} from 'pino';

const logger = pino({
  // Logging is turned off in test environment.
  enabled: !(process.env.NODE_ENV === 'test'),
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino/file',
    options: {
      destination: path.join(process.cwd(), 'logs', 'process.log'),
      mkdir: true,
    },
  },
});

export default logger;
