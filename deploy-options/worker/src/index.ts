/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import CultureBot from "./../../../settings/config";
import { validateWebhook } from "./validateWebhook";
import { ENVELOPES, finale } from "speedybot-mini";
export interface Env {
  BOT_TOKEN: string;
  WEBHOOK_SECRET: string;
  VOICEFLOW_KEY: string;
}
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method.toLowerCase() === "get") {
      return new Response("You must POST to this endpoint");
    }
    CultureBot.setToken(env.BOT_TOKEN);
    CultureBot.addSecret("VOICEFLOW_KEY", env.VOICEFLOW_KEY);
    const json = await request.json();
    const signature = request.headers.get("x-spark-signature");
    const secret = env.WEBHOOK_SECRET;

    // Validate webhook
    if (secret && signature) {
      const proceed = await validateWebhook(json, secret, signature);
      if (proceed === false) {
        return new Response("Webhook Secret Rejected");
      }
    }

    ctx.waitUntil(
      new Promise<void>(async (resolve, reject) => {
        try {
          const isEnvelope = CultureBot.isEnvelope(json);
          if (isEnvelope) {
            await CultureBot.processIncoming(json as ENVELOPES);
          }
        } catch (e) {
          reject(e);
          return new Response(
            `Something happened, but backend is up and running: ${e}`
          );
        }
      })
    );
    return new Response(finale());
  },
};
