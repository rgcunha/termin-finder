import { ErrorRequestHandler, Handler } from "express";
import expressWinston from "express-winston";
import { logger } from "../services/logger";

export function requestLogger(): Handler {
  return expressWinston.logger({
    winstonInstance: logger.getNativeLogger(),
    meta: true,
    expressFormat: true,
    colorize: false,
    headerBlacklist: ["authorization"],
  });
}

export function errorLogger(): ErrorRequestHandler {
  return expressWinston.errorLogger({
    winstonInstance: logger.getNativeLogger(),
  });
}
