import { Mirai, MiraiApiHttpSetting, MiraiInstance } from 'mirai-ts'
import { User } from '../../types/User'
import { resolveApiHttpConfig } from '../../config/apiHttpCOnfig'
import { DefaultHandler } from '../handle/DefaultHandler'
import { CircleBot } from '../../types'
import { HandlerList, OtherUse } from '../../types/UseType'

export class Bot implements CircleBot {
	/**
	 * 用户
	 */
	user: User
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
	 * 开发模式
	 */
	isDev: boolean

	/**
	 * user
	 * httpsetting
	 * @param userConfig
	 */
	constructor(userConfig: User) {
		const env: 'development' | 'production' = process.env.NODE_ENV as
			| 'development'
			| 'production'
		env === 'production' ? (this.isDev = false) : (this.isDev = true)
		const settingConfig = resolveApiHttpConfig(this.isDev)
		this.setting = settingConfig as MiraiApiHttpSetting

		this.user = userConfig
		this.mirai = new Mirai(settingConfig)
		this.OtherUse = []
		this.handlerList = []
	}
	/**
	 * 将模块添加到Mirai中来
	 * @param useMod
	 */
	use(useMod: HandlerList | OtherUse) {
		const handler = isOfType<DefaultHandler>(useMod, 'handler')
		if (handler) {
			this.handlerList.push(useMod as HandlerList)
		} else {
			this.OtherUse.push(useMod as OtherUse)
		}
	}
	start() {
		this.mirai?.link(this.user.qq)
		this.mirai?.on('message', msg => {
			this.handlerList.forEach(item => {
				item.watch(msg)
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
