import { ReplyHandler } from './handle'
import { CircleBot } from './Instance/Bot'

// 机器人
export { CircleBot }
// Handler相关类型
export { ReplyHandlerType } from './types/HandlerType'
// Mod拓展
export { ReplyModType } from './types/ModType'
// 处理器
export * from './handle'
const bot = new CircleBot(
	783366159,
	'../mcl/config/net.mamoe.mirai-api-http/setting.yml'
)
bot.use(new ReplyHandler())
bot.start()
