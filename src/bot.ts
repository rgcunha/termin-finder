import { Context, Telegraf } from "telegraf";
import {
  AvailabilitySearchParams,
  AvailabilitySearchResults,
  client as doctolibClient,
} from "./clients/doctolib";

const users = new Map();
const bot = new Telegraf<Context>(process.env.TELEGRAM_BOT_TOKEN as string);
let interval: NodeJS.Timeout;

bot.start((ctx: Context) => {
  users.set(ctx.from?.id, ctx.chat?.id);
  ctx.reply("Searching for appointments...");
});

bot.command("stop", (ctx) => {
  users.delete(ctx.from?.id);
  ctx.reply("No longer searching for appointments...");
});

function broadcast(msg: string): void {
  users.forEach((__, chatId) => {
    bot.telegram.sendMessage(chatId, msg);
  });
}

async function searchAvailabilities(): Promise<AvailabilitySearchResults> {
  const searchParams: AvailabilitySearchParams = {
    startDate: new Date().toISOString().split("T")[0],
    visitMotiveIds: [2836662],
    agendaIds: [469719],
    insuranceSector: "public",
    practiceIds: [162056],
    limit: 3,
  };
  const searchResults = await doctolibClient.searchAvailabilities(searchParams);
  return searchResults;
}

function start(): void {
  bot.launch();
  interval = setInterval(async () => {
    const searchResults = await searchAvailabilities();
    const msg = `We found the following results for you: ${JSON.stringify(searchResults)}`;
    broadcast(msg);
  }, 3000);
}

function stop(reason: string): void {
  clearInterval(interval);
  bot.stop(reason);
}

export default { start, stop };
