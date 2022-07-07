import { ReplyHandler } from './handle'
import { CircleBot } from './Instance/Bot'

const bot = new CircleBot(
	783366159,
	'../mcl/config/net.mamoe.mirai-api-http/setting.yml'
)
bot.use(new ReplyHandler())
bot.start()
