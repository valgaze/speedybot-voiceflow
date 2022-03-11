## Quickstart

Note: The steps below assume you have a working WebEx account & **[Nodejs](https://nodejs.org/en/download/)** 12+ & a **[voiceflow](https://voiceflow.com/) account** 

## 1. Fetch repo & install dependencies

```
git clone https://github.com/valgaze/speedybot-voiceflow
cd speedybot-voiceflow
npm run setup
```

## 2. Set your bot access token

- If you have an existing bot, get its token here: **[https://developer.webex.com/my-apps](https://developer.webex.com/my-apps)**

- If you don't have a bot, create one and save the token from here: **[https://developer.webex.com/my-apps/new/bot](https://developer.webex.com/my-apps/new/bot)**

Once you have the bot's token, save it to **[settings/config.json](./settings/config.json)** under the ```token``` field

Get your voiceflow api key (from your project tap **integrations** on the left panel and retrieve the **"Dialog API Key"**) and save it to **[settings/voiceflow.json](./settings/voiceflow.json)** under the ```apiKey``` field

## 3. Boot your Bot

```sh
npm start
```

If all went well, it should look something like this:
![image](https://raw.githubusercontent.com/valgaze/speedybot/master/docs/assets/framework_success.png)