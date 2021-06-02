import repl from "repl";
import { client } from "../src/clients/doctolib";
import server from "../src/server";
import { appointmentService } from "../src/services/appointment";

// open the repl session
const replServer = repl.start({
  prompt: `termin-finder (${process.env.ENVIRONMENT}) >`,
});

// attach app modules to the repl context
replServer.context.server = server;
replServer.context.client = client;
replServer.context.appointmentService = appointmentService;

/* eslint-disable no-console */
replServer.on("exit", () => {
  console.log('Received "exit" event from repl!');
  process.exit();
});
