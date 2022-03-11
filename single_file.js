/**
 * Dependencies Required:
 * npm install speedybot node-webex-bot-framework
 * 
 * For a full "batteries-inculded" option, see here: https://github.com/valgaze/speedybot-voiceflow
 * 
 */

 const { $, Launch, SpeedyCard, good, bad} = require('speedybot')
 const axios = require('axios')
 // API Keys
 const bot_token = 'aaa-bbb-ccc-ddd-eee'; // If you need one, get one here: https://developer.webex.com/my-apps/new/bot
 const voiceflow_api_key = 'www-xxx-yyy-zzz'// From your project select "Integrations" then retrieve the value from "Dialog API Key" 
 const vf = new VFHelper(voiceflow_api_key)
 
 
 const handlers = [
     {
         keyword: '<@catchall>',
         async handler(bot, trigger) {
             const $bot = $(bot)
 
             let res
             let session = await $bot.getData('session')
             if (!session) {
                 session = $bot.rando()
                 await $bot.saveData('session', session)
                 // Send a launch request here??
                 res = await vf.launch(session)
             } else {
                 res = await vf.send(session, trigger.text)
             }
         
             for (let i = 0; i < res.length; i++) {
                 const item = res[i]
 
                 const { type, value } = item
                 if (type === 'text') {
                     await bot.say(value)
                 }
 
                 if (type === 'choice') {
                     await $bot.sendChips(value)
                 }
 
                 if (type === 'visual' && value) {
                     const card = new SpeedyCard().setImage(value)
                     await bot.sendCard(card.render(), value)
                 }
             }
         },
         helpText: 'Runs for all inputs'
     },
     {
         keyword: '<@fileupload>',
         async handler(bot, trigger) {
           const supportedFiles = ['json', 'txt', 'csv']
           // take 1st file uploaded, note this is just a URL & not authenticated
           const [file] = trigger.message.files
 
           // Retrieve file data
           const fileData = await $(bot).getFile(file)
           const { extension, type } = fileData
 
                if (supportedFiles.includes(extension)) {
                     const {data} = fileData
             // bot.snippet will format json or text data into markdown format
             bot.say({markdown: $(bot).snippet(data)})
             // ex. Send data somewhere or to 3rd-party service
                     } else {
             bot.say(`Sorry, somebody needs to add support to handle *.${extension} (${type}) files`)
               }
         },
         helpText: 'A special handler that will activate whenever a file is uploaded'
     },
 ]
 
 
 // Boot agent
 Launch({token: bot_token}, handlers).then(_ => good('Success!')).catch(e => bad(e))
 
 
 
 // Helper
 function VFHelper(apiKey) {
    class Voiceflow {
        constructor(apiKey) {
            this.apiKey = apiKey
            this.axios = axios.create({
                baseURL: 'https://general-runtime.voiceflow.com',
                headers: {
                  Authorization: this.apiKey,
                },
                method: 'POST',
            });
        }
    
        tidyResponse(response){
            const responses = []
            const suggestionChips = []

            response.forEach(item => {
                const { type } = item
                
                if (item.type === 'text') {
                    responses.push({ type, value: item.payload.message })
                }
    
                if (item.type === 'choice') {
                    const buttons = item.payload.buttons.map(button => {
                        const { request } = button
                        return request.payload
                    })
                    suggestionChips.push({ type, value: buttons })
                }
    
                if (item.type === 'visual') {
                    if (item.payload.visualType === 'image') {
                        const { image } = item.payload
                        responses.push({ type, value: image })
                    }
                }
            })
            return responses.concat(suggestionChips)
        }
    
        async send(sessionId, message, payload = {}) { 
            const response = await this._send(sessionId, message, payload)
            return this.tidyResponse(response)
        }
    
        async _send(sessionId, message, payload = {}){ 
            const data = {
                action: {
                  type: 'text',
                  payload: message,
                },
                ...payload
            }
    
            const response = await this.axios({
                url: `/state/user/${sessionId}/interact`,
                data,
              });
              return response.data
        }
    
        async launch(sessionId) {
          const response = await this.axios({
            url: `/state/user/${sessionId}/interact`,
            data: { type: 'launch '},
          })
          return this.tidyResponse(response.data)
        }
    
    }
     return new Voiceflow(apiKey)
 }