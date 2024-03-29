import "cross-fetch/polyfill";
import dotenv from "dotenv";
import { logoRoll } from "speedybot-mini";
import path from "path";
import { Websocket } from "./utils";

// Expects .env to get token on BOT_TOKEN
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import CultureBot from "./../settings/config";

const token = process.env.BOT_TOKEN as string;
const VOICEFLOW_KEY = process.env.VOICEFLOW_KEY as string;
if (!token) {
  console.log("\n## Token missing (check .env file)");
  process.exit(0);
}
main(token, VOICEFLOW_KEY);

async function main(token: string, VOICEFLOW_KEY: string) {
  CultureBot.setToken(token);
  CultureBot.addSecret("VOICEFLOW_KEY", VOICEFLOW_KEY);
  const inst = new Websocket(token);
  await inst.start();
  console.log(logoRoll());
  console.log("Websockets Registered. Listening...");

  inst.on("message", (websocketEvent: any) => {
    // send to processing incoming websocket
    CultureBot.processIncoming(websocketEvent);
  });

  inst.on("submit", (websocketSubmitEvent: any) => {
    CultureBot.processIncoming(websocketSubmitEvent);
  });
}
