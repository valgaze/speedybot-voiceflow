import { MyStack } from "./MyStack";
import { App } from "@serverless-stack/resources";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    environment: {
      token: process.env.BOT_TOKEN as string, // bot token, make one here: https://developer.webex.com/my-apps/new
      secret: process.env.secret as string, // webhook secret
      VOICEFLOW_KEY: process.env.VOICEFLOW_KEY as string,
    },
    bundle: {
      format: "esm",
    },
  });
  app.stack(MyStack);
}
