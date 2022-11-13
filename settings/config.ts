// Speedybot setup
import { Speedybot } from "speedybot-mini";
// Helpers for VF
import {
  processResponse,
  VFHelper,
  VF_SUBMIT_LABEL,
  VF_SUBMIT_LABEL_INTENT,
} from "./voiceflow";

// Auth secrets
const { BOT_TOKEN, VOICEFLOW_KEY } = process.env;

const CultureBot = new Speedybot(BOT_TOKEN);
export default CultureBot;

const vf_inst = new VFHelper(VOICEFLOW_KEY as string);

// Clear the board
CultureBot.contains(["$clear", "reset"], async ($bot) => $bot.clearScreen());

// Runs on every text interaction
CultureBot.nlu(async ($bot, msg) => {
  try {
    const session = msg.authorId;
    let hasVisited = await vf_inst.getData<true | null>("hasVisited", session);

    let res;
    if (!hasVisited) {
      res = await vf_inst.launch(session);
      await vf_inst.saveData("hasVisited", true, session);
    } else {
      res = await vf_inst.send(msg.text, session);
    }
    const tidyResponse = vf_inst.simplifyResponse(res);

    const { hasEnd } = tidyResponse;

    if (hasEnd) {
      // If reach terminal point of conversation don't leave user hanging, relaunch
      const res = await vf_inst.launch(session);
      await processResponse($bot, vf_inst.simplifyResponse(res));
    } else {
      // pass tidy response in to processor
      await processResponse($bot, tidyResponse);
    }
  } catch (e) {
    console.log("Error", e);
    $bot.send(`There was an error: ${e}`);
  }
});

// Buttons, chips, card transmissions
CultureBot.onSubmit(async ($bot, msg) => {
  if (
    msg.data.inputs[VF_SUBMIT_LABEL] ||
    msg.data.inputs[VF_SUBMIT_LABEL_INTENT]
  ) {
    // Destroy card
    $bot.deleteMessage(msg.data.messageId);
    const session = msg.authorId;

    // PathId
    const id = msg.data.inputs[VF_SUBMIT_LABEL];
    const intent = msg.data.inputs[VF_SUBMIT_LABEL_INTENT];
    let res = Boolean(intent)
      ? await vf_inst.clickIntent(session, intent)
      : await vf_inst.clickButton(session, id);

    // if empty array, something went wrong or tapped old cold
    if (!res.length) {
      // Destroy card (since invalid)
      $bot.deleteMessage(msg.data.messageId);
      res = await vf_inst.launch(session);
    }
    const tidyResponse = vf_inst.simplifyResponse(res);
    const { hasEnd } = tidyResponse;

    if (hasEnd) {
      // If reach terminal part of conversation don't leave user hanging
      const res = await vf_inst.launch(session);
      await processResponse($bot, vf_inst.simplifyResponse(res));
    } else {
      // pass tidy response in to processor
      await processResponse($bot, tidyResponse);
    }

    $bot.deleteMessage(msg.id);
  } else {
    // Other attachmentActions submissions
    // Ex. From here data could be transmitted to another service or a 3rd-party integrationn
    $bot.say(
      `Submission received! You sent us ${JSON.stringify(msg.data.inputs)}`
    );
  }
});
