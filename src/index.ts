import { broadcast } from "./bot";
import { client as redisClient } from "./clients/redis";
import httpServer from "./server";
import createAppointmentService, { Appointment } from "./services/appointment";
import createLogger from "./services/logger";

const appointmentService = createAppointmentService();
const logger = createLogger();
let interval: NodeJS.Timeout;

async function sendAppointments(appointments: Appointment[]): Promise<void> {
  const appointmentsWithDate = appointments.filter((appointment) => appointment.date);
  await Promise.all(
    appointmentsWithDate.map(async (appointment) => {
      const { date, placeName, url } = appointment;
      const msg = `📆 Available slots found at <i>${placeName}</i> on <b>${date}</b>: ${url}`;
      await broadcast(msg);
    })
  );
}

function start(): void {
  logger.info("Booting up...");
  const fetchInterval = parseInt(process.env.FETCH_INTERVAL as string, 10);
  interval = setInterval(async () => {
    const startDate = new Date().toISOString().split("T")[0];
    const appointments = await appointmentService.searchVaccinationAppointments(startDate);
    sendAppointments(appointments);
  }, fetchInterval);
  broadcast("Hello 👋");
  httpServer.start();
}

function shutdown(reason: string): void {
  // eslint-disable-next-line no-console
  console.log(`Shuting down... reason: ${reason}`);
  broadcast("Going to sleep.. 😴");

  setTimeout(() => {
    clearInterval(interval);
    httpServer.stop(() => {
      redisClient.disconnect();
      process.exit(0);
    });
  }, 5000);
}

process.on("SIGINT", () => shutdown("SIGINT")).on("SIGTERM", () => shutdown("SIGTERM"));

start();
