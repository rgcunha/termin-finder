import { Handler } from "express";
import { bot, secretPath } from "../bot";

export function telegramWebHook(): Handler {
  return bot.webhookCallback(`/api/hooks/${secretPath}`);
}

export default { telegramWebHook };
