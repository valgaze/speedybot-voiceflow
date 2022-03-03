import { SpeedybotWebhook } from 'speedybot'
import express from 'express'
import bodyParser from 'body-parser'
import { join } from 'path'
import handlers from './../../settings/handlers'
import config from './../../settings/config.json'

const app = express()
const port = process.env.PORT || 8000

app.use(express.static(join(__dirname, 'ui')));
app.use(bodyParser.json());
app.post('/ping', (req, res) => res.send('pong!'))


app.post('/speedybotwebhook', SpeedybotWebhook(config, handlers, app))

app.listen(port, () => {
    console.log(`Listening + tunneled on port ${port}`)
})
