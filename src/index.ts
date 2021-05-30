import telegramBot from "./bot";
import httpServer from "./server";

function start(): void {
  httpServer.start();
  telegramBot.start();
}

function shutdown(reason: string): void {
  /* eslint-disable no-console */
  console.log(`Shuting down... reason: ${reason}`);
  telegramBot.stop(reason);
  httpServer.stop();
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

start();
