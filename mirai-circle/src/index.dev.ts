import { ReplyHandler } from './handle'
import { NudgeHandler } from './handle/NudgeHandler'
import { CircleBot } from './Instance/Bot'
import { Nudge } from './mods/EventMod/index'
const bot = new CircleBot(
	1054081929,
	'../mcl/config/net.mamoe.mirai-api-http/setting.yml'
)
bot.use(new ReplyHandler())
bot.use(new NudgeHandler(Nudge()))
bot.start()
