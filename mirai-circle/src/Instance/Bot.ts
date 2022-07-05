import { Logger, Mirai, MiraiApiHttpSetting, MiraiInstance } from 'mirai-ts'
import { CircleBotType } from '../types/Bot'
import { HandlerList, OtherUse } from '../types/UseType'
import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as path from 'path'
import { ReplyHandlerType } from '../types/HandlerType'

export class CircleBot implements CircleBotType {
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
	 * 配置文件的绝对目录
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
	constructor(qq: number, settingPath: string) {
		this.log = new Logger()
		if (!fs.existsSync(path.resolve(process.cwd(), 'configs'))) {
			fs.mkdirSync(path.resolve(process.cwd(), 'configs'))
		}
		this.configtPath = ''
		const settingConfig = this.resolveApiHttpConfig(settingPath)
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
		this.log.info('正在加载处理器')
		const handler = isOfType<ReplyHandlerType>(useMod, 'handler')
		if (handler) {
			useMod.load()
			this.handlerList.push(useMod as HandlerList)
		} else {
			this.OtherUse.push(useMod as OtherUse)
			this.log.warning('加载了一个非内置的处理器，请注意是否是正确的处理器。')
		}
		this.log.success('处理器加载成功')
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
	/**
	 * 处理setting.yml路径
	 * @param settingPath
	 * @returns
	 */
	resolveApiHttpConfig = (settingPath: string) => {
		let sPath = ''
		const isAbsolute = path.isAbsolute(settingPath)
		if (isAbsolute) {
			sPath = settingPath
		} else {
			sPath = path.resolve(process.cwd(), settingPath)
		}
		this.configtPath = sPath
		try {
			const setting = yaml.load(
				fs.readFileSync(sPath, 'utf8')
			) as MiraiApiHttpSetting

			return setting
		} catch (err) {
			throw new Error('没有找到' + sPath + '的配置文件，请检查路径是否正确。')
		}
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
