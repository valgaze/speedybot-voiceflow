import {resolve} from 'path'
import {writeFileSync} from 'fs'
const [,,token] = process.argv
export const writeJSON = (content: { token: string }, path: string) => {
	const pretty = `${JSON.stringify(content, null, 2)}\n`;
	const writePath = resolve(path);
	return writeFileSync(writePath, pretty, 'utf8');
}

if (token) {
    writeJSON({token}, resolve(__dirname, '..', '..', 'settings', 'config.json'))
} 