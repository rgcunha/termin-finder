import Queue from "bull";
import { logger } from "../services/logger";
import createHealthCheckProcessor from "./processors/health";

export interface IWorker {
  start(): void;
  enqueueJob(jobData: Record<string, unknown>, queueName: string): Promise<Queue.Job>;
  queues: Map<string, Queue.Queue>;
}

function createWorker(): IWorker {
  const queues = new Map<string, Queue.Queue>();
  const maxJobsPerWorker = 1;

  async function enqueueJob(
    jobData: Record<string, unknown>,
    queueName: string,
    jobOptions?: Queue.JobOptions
  ): Promise<Queue.Job> {
    const queue = queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} does not exist`);
    const job = await queue.add(jobData, jobOptions);
    logger.info(`Job ${job.id} added to work queue: ${queueName}`);
    return job;
  }

  async function enqueueScheduledJob(
    jobData: Record<string, unknown>,
    queueName: string,
    cron: string
  ): Promise<Queue.Job> {
    const repeat = { cron };
    const jobOptions = { repeat };
    return enqueueJob(jobData, queueName, jobOptions);
  }

  function enqueueScheduledJobs() {
    const jobData = { url: `https://rgcunha-termin-finder.herokuapp.com/api/health` };
    const cron = "* * * * *";
    enqueueScheduledJob(jobData, "health check", cron);
  }

  function start() {
    const processor = createHealthCheckProcessor();
    const queue = new Queue("health check", process.env.REDIS_URL as string);
    queue.process(maxJobsPerWorker, processor.execute);
    queues.set(queue.name, queue);
    logger.info("worker ready");

    enqueueScheduledJobs();
  }

  return {
    queues,
    start,
    enqueueJob,
  };
}

export const worker = createWorker();
export default createWorker;
