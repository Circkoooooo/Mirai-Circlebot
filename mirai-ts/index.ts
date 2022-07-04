import { ReplyHandler } from './src/handle/ReplyHandler'
import { Bot } from './src/Instance/Bot'

const bot = new Bot({ qq: 783366159 })
bot.use(new ReplyHandler())
bot.start()
