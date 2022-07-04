import { Logger, Mirai, MiraiApiHttpSetting, MiraiInstance } from 'mirai-ts'
import { CircleBot } from '../types/Bot'
import { HandlerList, OtherUse } from '../types/UseType'
import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as path from 'path'
import { ReplyHandlerType } from '../types/HandlerType'

export default class Bot implements CircleBot {
	/**
	 * 用户
	 */
	qq: number
	/**
	 * Mirai实例
	 */
	mirai: MiraiInstance | null
	/**
	 * apiHttp配置
	 */
	setting: MiraiApiHttpSetting
	/**
	 * handler列表
	 */
	handlerList: Array<HandlerList>
	/**
	 * 用于存放其他UseMod
	 */
	OtherUse: Array<OtherUse>
	/**
	 * 配置文件的目录
	 */
	configtPath: string

	/**
	 * log
	 */
	log: Logger
	/**
	 * user
	 * httpsetting
	 */
	constructor(qq: number) {
		this.log = new Logger()
		this.configtPath = path.resolve('config/BotConfig')
		const settingConfig = resolveApiHttpConfig()
		this.setting = settingConfig as MiraiApiHttpSetting
		this.qq = qq

		this.mirai = new Mirai(settingConfig)
		this.OtherUse = []
		this.handlerList = []
	}
	/**
	 * 将模块添加到Bot中来
	 * @param useMod
	 */
	use(useMod: HandlerList | OtherUse) {
		const handler = isOfType<ReplyHandlerType>(useMod, 'handler')
		if (handler) {
			this.handlerList.push(useMod as HandlerList)
		} else {
			this.OtherUse.push(useMod as OtherUse)
		}
	}

	start() {
		this.mirai?.link(this.qq)
		this.mirai?.on('message', msg => {
			this.handlerList.forEach(item => {
				item.watchChatMessage(msg)
			})
		})
		this.mirai?.listen()
	}
}

/**
 * 判断是否是某个类型
 * @param use
 * @param propertyToCheckFor
 * @returns
 */
function isOfType<T>(use: any, propertyToCheckFor: keyof T): use is T {
	return (use as T)[propertyToCheckFor] !== undefined
}
/**
 * 处理setting路径
 * @returns
 */
const resolveApiHttpConfig = () => {
	let filePath = ''
	filePath = path.resolve('../mcl/config/net.mamoe.mirai-api-http/setting.yml')

	try {
		const setting = yaml.load(
			fs.readFileSync(filePath, 'utf8')
		) as MiraiApiHttpSetting
		return setting
	} catch (err) {
		new Logger().error(
			'请将项目文件夹放在和mcl相同的根目录下，以读取mcl中的config配置'
		)
		return
	}
}
