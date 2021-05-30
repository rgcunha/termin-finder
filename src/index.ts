import { broadcast } from "./bot";
import httpServer from "./server";
import createAppointmentService from "./services/appointment";
import createLogger from "./services/logger";

const appointmentService = createAppointmentService();
const logger = createLogger();
let interval: NodeJS.Timeout;

function start(): void {
  httpServer.start();
  const fetchInterval = parseInt(process.env.FETCH_INTERVAL as string, 10);
  interval = setInterval(async () => {
    const searchResults = await appointmentService.searchAvailabilities();
    const msg = `We found the following results for you: ${JSON.stringify(searchResults)}`;
    broadcast(msg);
  }, fetchInterval);
}

function shutdown(reason: string): void {
  logger.info(`Shuting down... reason: ${reason}`);
  clearInterval(interval);
  httpServer.stop();
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

start();
