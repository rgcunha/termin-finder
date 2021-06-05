import throng from "throng";
import { worker } from "./worker";

const workers = process.env.WEB_CONCURRENCY || 1;
throng({ workers, start: worker.start });
