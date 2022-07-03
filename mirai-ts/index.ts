import { user } from './config/Login'
import { ReplyHandler } from './src/handle/ReplyHandler'
import { Bot } from './src/Instance/Bot'
import { OtherUse } from './types/UseType'

const bot = new Bot(user)
bot.use(new ReplyHandler())
bot.use({ is: 'string' } as OtherUse)
bot.start()
