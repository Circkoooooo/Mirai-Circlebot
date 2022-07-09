import { Logger, Mirai, MiraiApiHttpSetting, MiraiInstance } from 'mirai-ts'
import { CircleBotType } from '../types/Bot'
import { HandlerList, OtherUse } from '../types/UseType'
import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as path from 'path'
import { ReplyHandlerType } from '../types/HandlerType'
import { HandlerWhiteListType } from '../types/ReplyConfigType'

export class CircleBot implements CircleBotType {
	/**
	 * 用户
	 */
	qq: number
	/**
	 * Mirai实例
	 */
	mirai: MiraiInstance
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

	groupWhiteList: Array<number>
	friendWhiteList: Array<number>
	_whiteListPath: string
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
		this.groupWhiteList = []
		this.friendWhiteList = []
		this._whiteListPath = path.resolve(
			process.cwd(),
			'configs/HandlerWhiteList.yml'
		)
	}
	/**
	 * 将模块添加到Bot中来
	 * @param useMod
	 */
	async use(useMod: HandlerList | OtherUse) {
		this.log.info('正在加载处理器')
		await this.loadHandlerWhiteList()
		const handler = isOfType<ReplyHandlerType>(useMod, 'handler')
		if (handler) {
			useMod.load(this.friendWhiteList, this.groupWhiteList, this.mirai)
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
				if (item.type === 'Message') {
					item.watchChatMessage(msg)
				}
			})
		})
		this.mirai?.on('NudgeEvent', msg => {
			this.handlerList.forEach(item => {
				if (item.type === 'Nudge') {
					item.watchNudge(msg)
				}
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

	/**
	 * 加载白名单列表
	 */
	async loadHandlerWhiteList() {
		this.log.info('正在加载处理器白名单列表')
		const exist = fs.existsSync(this._whiteListPath)
		try {
			if (!exist) {
				const whiteListTemplate: HandlerWhiteListType = {
					groupWhiteList: [],
					friendWhiteList: [],
				}
				const whiteList = yaml.dump(whiteListTemplate)
				fs.writeFile(this._whiteListPath, whiteList, 'utf-8', err => {
					if (err) {
						throw err
					}
				})
			} else {
				const res = await fs.promises.readFile(this._whiteListPath, 'utf-8')
				const originWhiteList = yaml.load(res) as HandlerWhiteListType
				const { groupWhiteList, friendWhiteList } =
					originWhiteList === undefined
						? ({} as HandlerWhiteListType)
						: originWhiteList

				const writeListTemplate: HandlerWhiteListType = {
					groupWhiteList: groupWhiteList === undefined ? [] : groupWhiteList,
					friendWhiteList: friendWhiteList === undefined ? [] : friendWhiteList,
				}
				this.friendWhiteList = writeListTemplate.friendWhiteList
				this.groupWhiteList = writeListTemplate.groupWhiteList
			}
		} catch (err) {
			this.log.error('请检查HandlerWhiteList白名单是否配置正确')
		}
		this.log.success('处理器白名单列表加载成功')
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
