import { user } from './config/Login'
import { ReplyHandler } from './src/handle/ReplyHandler'
import { Bot } from './src/Instance/Bot'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { ReplyConfigType } from './types/ReplyConfigType'

const loadConfig = () => {
	const replyConfig = yaml.load(
		fs.readFileSync(path.resolve('./config/ReplyConfig.yml'), 'utf-8')
	) as ReplyConfigType
	return {
		replyConfig,
	}
}

const { replyConfig } = loadConfig()
const bot = new Bot(user)
bot.use(new ReplyHandler(replyConfig))
bot.start()
