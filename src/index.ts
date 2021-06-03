import { broadcast } from "./bot";
import createRedisClient from "./clients/redis";
import httpServer from "./server";
import createAppointmentService, { Appointment } from "./services/appointment";
import createLogger from "./services/logger";

const appointmentService = createAppointmentService();
const logger = createLogger();
const redisClient = createRedisClient();
let interval: NodeJS.Timeout;

async function sendAppointments(appointments: Appointment[]) {
  appointments.forEach((appointment) => {
    const { date, placeName, url } = appointment;
    if (date) {
      const msg = `📆 Available slots found at <i>${placeName}</i> on <b>${date}</b>: ${url}`;
      broadcast(msg);
    }
  });
}

function start(): void {
  logger.info("Booting up...");
  const fetchInterval = parseInt(process.env.FETCH_INTERVAL as string, 10);
  interval = setInterval(async () => {
    const startDate = new Date().toISOString().split("T")[0];
    const appointments = await appointmentService.searchVaccinationAppointments(startDate);
    sendAppointments(appointments);
  }, fetchInterval);
  httpServer.start();
  logger.info("HTTP Server: Ready");
}

async function shutdown(reason: string): Promise<void> {
  logger.info(`Shuting down... reason: ${reason}`);
  httpServer.stop();
  clearInterval(interval);
  await redisClient.disconnect();
  logger.info("HTTP Server: Down");
}

process.once("SIGINT", async () => shutdown("SIGINT"));
process.once("SIGTERM", async () => shutdown("SIGTERM"));

start();
