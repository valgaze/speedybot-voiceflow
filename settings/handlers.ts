import { BotHandler, $, SpeedyCard} from 'speedybot'
import { Voiceflow } from './vf'
import { apiKey } from './voiceflow.json'

const handlers: BotHandler[] = [
	{
		keyword: '<@catchall>',
		async handler(bot, trigger) {
			const $bot = $(bot)
			const vf = new Voiceflow(apiKey)

			let res;
			let session = await $bot.getData('session')
			if (!session) {
				session = $bot.rando()
				await $bot.saveData('session', session)
				// Send a launch request here??
				res = await vf.BAD_IMPLEMENTATION_LAUNCH(session)

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
					await $bot.sendChips(value as string[])
				}

				if (type === 'visual' && value) {
					const card = new SpeedyCard()
										.setImage(value as string)

					await bot.sendCard(card.render(), value as string)
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
	{
		keyword: '<@submit>',
		handler(bot, trigger) {
			// Ex. From here data could be transmitted to another service or a 3rd-party integrationn
			bot.say(`Submission received! You sent us ${JSON.stringify(trigger.attachmentAction.inputs)}`)

		},
		helpText: `A special handler that fires anytime a user submits data (you can only trigger this handler by tapping Submit in a card)`
	},
]

export default handlers