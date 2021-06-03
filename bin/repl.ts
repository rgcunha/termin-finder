import repl from "repl";
import { client as doctolibClient } from "../src/clients/doctolib";
import { client as redisClient } from "../src/clients/redis";
import server from "../src/server";
import { appointmentService } from "../src/services/appointment";

// open the repl session
const replServer = repl.start({
  prompt: `termin-finder (${process.env.ENVIRONMENT}) >`,
});

// attach app modules to the repl context
replServer.context.server = server;
replServer.context.clients = {
  doctolibClient,
  redisClient,
};
replServer.context.services = {
  appointmentService,
};

/* eslint-disable no-console */
replServer.on("exit", () => {
  console.log('Received "exit" event from repl!');
  process.exit();
});
