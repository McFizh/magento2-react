import { createLogger, transports } from 'winston';

export const Logger = createLogger({
  transports: [
    new transports.Console()
  ]
});