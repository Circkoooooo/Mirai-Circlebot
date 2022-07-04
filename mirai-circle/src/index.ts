import Bot from './Instance/Bot'
import { ReplyHandler } from './handle'
export { ReplyHandler, Bot }

const bot = new Bot(783366159)
bot.use(new ReplyHandler())
bot.start()
