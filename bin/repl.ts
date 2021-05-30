import repl from "repl";
import { client } from "../src/clients/doctolib";
import server from "../src/server";

// open the repl session
const replServer = repl.start({
  prompt: `termin-finder (${process.env.ENVIRONMENT}) >`,
});

// attach app modules to the repl context
replServer.context.server = server;
replServer.context.client = client;

/* eslint-disable no-console */
replServer.on("exit", () => {
  console.log('Received "exit" event from repl!');
  process.exit();
});
