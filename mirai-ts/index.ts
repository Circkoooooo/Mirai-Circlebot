import { user } from './config/Login'
import { ReplyHandler } from './src/handle/ReplyHandler'
import { Bot } from './src/Instance/Bot'

const bot = new Bot(user)
bot.use(new ReplyHandler())
bot.start()
