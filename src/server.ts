import express from "express";
import { Server } from "http";
import healthController from "./controllers/health";
import { errorLogger, requestLogger } from "./middleware/logger";

const app: express.Application = express();
const server: Server = new Server(app);
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger());

app.get("/api/health", healthController.get);
app.use(errorLogger());

function start(): void {
  server.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`listening on *:${port}`);
  });
}

function stop(): void {
  server.close();
}

export default { start, stop };
