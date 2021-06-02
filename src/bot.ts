import crypto from "crypto";
import { Context, Telegraf } from "telegraf";

const users = new Map();
const token = process.env.TELEGRAM_BOT_TOKEN as string;

function createSecretPath() {
  return crypto
    .createHash("sha3-256")
    .update(token)
    .update(process.version) // salt
    .digest("hex");
}

const secretPath = createSecretPath();
const bot = new Telegraf<Context>(token);

bot.telegram.setWebhook(`${process.env.URL}/api/hooks/${secretPath}`);

bot.start((ctx: Context) => {
  users.set(ctx.from?.id, ctx.chat?.id);
  ctx.reply("Searching for appointments...");
});

bot.command("start", (ctx) => {
  users.set(ctx.from?.id, ctx.chat?.id);
  ctx.reply("Searching for appointments...");
});

bot.command("stop", (ctx) => {
  users.delete(ctx.from?.id);
  ctx.reply("No longer searching for appointments...");
});

function broadcast(msg: string): void {
  users.forEach((__, chatId) => {
    bot.telegram.sendMessage(chatId, msg, { parse_mode: "HTML", disable_web_page_preview: true });
  });
}

export { broadcast, bot, secretPath };
