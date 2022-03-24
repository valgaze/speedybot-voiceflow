## Speedybot-voiceflow

## Quickstart

## 1) Clone repo & install dependencies

```
git clone https://github.com/valgaze/speedybot-voiceflow
cd speedybot-voiceflow
npm install
```

## 2) WebEx token

- If you don't have a bot, create one and save the token from here: **[https://developer.webex.com/my-apps/new/bot](https://developer.webex.com/my-apps/new/bot)**

- Set WebEx token in **[settings/config.json](./settings/config.json)** under the ```token``` field

## 3) Upload the Voiceflow project

- To get up and running quickly you can you can use the **[settings/icecream_shop.vf](./settings/icecream_shop.vf)** file as a starter project

- From your voiceflow dashboard, find the import button in the top right corner and pick a Voiceflow Project, you should see a project that looks something like this 

![img](./docs/assets/import_voiceflow.gif)


## 4) Voiceflow Canvas api key

- From your project tap the Voiceflow icon in the top right corner select **Project Settings** >> **Integrations**

- Set VoiceFlow api key in **[settings/voiceflow.json](./settings/voiceflow.json)** under the ```apiKey``` field

![img](./docs/assets/vf_key.png)


## 5) Boot it up!

```
npm run dev

# yarn run dev
```

![img](./docs/assets/vf_demo.gif)

## Video Instructions

- 101: https://share.descript.com/view/ds3UA1kUb9z

## Commands

| **Command** | **Desc** |
| --- | --- |
| ```npm run setup``` | Setup dependencies |
| ```npm run dev``` | Start with live-reload on code-changes |
| ```npm run ui``` | Boot web-based debug panel | 
| ```npm start``` | Start chat agent |
| ```npm start:server``` | Start server (you'll need to set ```webhookUrl``` in settings/config.json) |

## Demo

### Project

![img](./docs/assets/canvas.png)

### Agent

![img](./docs/assets/demo.gif)