import winston from "winston";

type TPayload = Record<string, unknown>;

export interface ILogger {
  getNativeLogger(): winston.Logger;
  info(message: string, payload?: TPayload): void;
  warn(message: string, payload?: TPayload): void;
  error(message: string, payload?: TPayload): void;
}

function createLogger(): ILogger {
  const DEFAULT_FORMATS = [winston.format.timestamp(), winston.format.json()];
  const formats =
    process.env.PRETTY_LOGS === "true"
      ? [...DEFAULT_FORMATS, winston.format.prettyPrint()]
      : DEFAULT_FORMATS;

  const nativeLogger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston.format.combine(...formats),
    defaultMeta: { service: "termin-finder" },
    transports: [new winston.transports.Console()],
  });

  function getNativeLogger(): winston.Logger {
    return nativeLogger;
  }

  function info(message: string, payload?: TPayload) {
    nativeLogger.info(message, payload);
  }

  function warn(message: string, payload?: TPayload) {
    nativeLogger.warn(message, payload);
  }

  function error(message: string, payload?: TPayload) {
    nativeLogger.error(message, payload);
  }

  return {
    getNativeLogger,
    info,
    warn,
    error,
  };
}

export const logger = createLogger();
export default createLogger;
