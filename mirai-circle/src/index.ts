import Bot from './Instance/Bot'
import { ReplyHandler } from './handle'

// 你的qq
const bot = new Bot(0)
bot.use(new ReplyHandler())
bot.start()
