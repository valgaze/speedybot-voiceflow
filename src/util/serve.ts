const [,,port='8000'] = process.argv
import {placeholder, loud} from 'speedybot'
import cli from 'cli-ux'
import { resolve } from 'path'

import { serveDir } from './static'
import { token } from './../../settings/config.json'

const ui_dir = resolve(__dirname, 'ui')
let ui_path = resolve(ui_dir, 'index.html')

async function main(filePath, port) {
let address = `http://localhost:${port}/index.html`
loud(`Running on ${port}

${address}`)

    await serveDir(ui_dir, port)

    // attempt to open w/ token
    if (token !== placeholder) {
        // append token
        address = `${address}?access_id=${token}`
    }
    await cli.open(address) 
    await cli.anykey().catch(e => { { console.log('Exiting...'); process.exit(0) }})
}

// Launch server
main(ui_path, port)
