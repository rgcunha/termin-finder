import crypto from "crypto";
import { Context, Telegraf } from "telegraf";
import { userService } from "./services/user";

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

async function broadcast(msg: string): Promise<void> {
  const users = await userService.getUsers();
  users.forEach((user) => {
    bot.telegram.sendMessage(user.chatId, msg, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  });
}

function subscribeNotifications(ctx: Context) {
  const user = {
    id: String(ctx.from?.id),
    chatId: String(ctx.chat?.id),
  };
  userService.addUser(user);
  ctx.reply("Searching for appointments...");
}

function unsubscribeNotifications(ctx: Context) {
  const userId = String(ctx.from?.id);
  userService.delUser(userId);
  ctx.reply("No longer searching for appointments...");
}

bot.start(subscribeNotifications);
bot.command("start", subscribeNotifications);
bot.command("stop", unsubscribeNotifications);

export { broadcast, bot, secretPath };
