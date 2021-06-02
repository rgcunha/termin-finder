import { broadcast } from "./bot";
import httpServer from "./server";
import createAppointmentService, { Appointment } from "./services/appointment";
import createLogger from "./services/logger";

const appointmentService = createAppointmentService();
const logger = createLogger();
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
  httpServer.start();
  const fetchInterval = parseInt(process.env.FETCH_INTERVAL as string, 10);
  interval = setInterval(async () => {
    const startDate = new Date().toISOString().split("T")[0];
    const appointments = await appointmentService.searchVaccinationAppointments(startDate);
    sendAppointments(appointments);
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
