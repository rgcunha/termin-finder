import axios from "axios";
import Queue from "bull";
import { logger } from "../../services/logger";

export interface IHealthCheckProcessor {
  execute(job: Queue.Job): Promise<void>;
}

function createHealthCheckProcessor(): IHealthCheckProcessor {
  async function execute(job: Queue.Job): Promise<void> {
    const { url } = job.data;
    try {
      await axios.get(url);
    } catch (err) {
      logger.error(`Error processing job ${job.id}`, err);
      throw err;
    }
  }

  return {
    execute,
  };
}

export default createHealthCheckProcessor;
