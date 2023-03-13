import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ENVELOPES } from "speedybot-mini";
import CultureBot from "./../../../../settings/config";
import { validateSignature } from "./validate_webhook";
import "cross-fetch/polyfill";
export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log("yo", event);

  // Check webhook secret
  const signature = event.headers["x-spark-signature"];
  const secret = process.env.secret; // webhook secret
  const voiceflow_key = process.env.VOICEFLOW_KEY;
  console.log("BOOMER");
  console.log("BOT", process.env.token);
  console.log("VOICEFLOW_KEY", voiceflow_key);

  // attach tokens + keys from process.env
  CultureBot.setToken(process.env.token as string);
  CultureBot.addSecret("VOICEFLOW_KEY", voiceflow_key as string);
  let data = {};
  if ("body" in event && event.body) {
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      console.log("#Error with body", e);
    }
  }

  // Webhook "secret" check
  if (secret && signature) {
    const proceed = validateSignature(
      signature as string,
      secret as string,
      data
    );

    if (!proceed) {
      return {
        statusCode: 200,
        body: "Webhook secret rejected",
      };
    }
  }

  try {
    CultureBot.contains("$clear", ($bot) => $bot.clearScreen());
    if (CultureBot.isEnvelope(data)) {
      await CultureBot.processIncoming(data as ENVELOPES);
    }
  } catch (e) {
    return {
      statusCode: 200,
      //@ts-ignore
      body: JSON.stringify({
        msg: `There was an error`,
        error: e,
      }),
    };
  }
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Speedybot: Your request was received at ${event.requestContext.time}.`,
  };
};
