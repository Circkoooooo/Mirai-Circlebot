import { MessageType } from 'mirai-ts'
import { DefaultHandler } from './DefaultHandler'
import { ReplyModType } from '../types/ModType'
import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import {
	ReplyModConfigType,
	ReplyWhiteListType,
} from '../types/ReplyConfigType'
import { ReplyHandlerType } from '../types/HandlerType'

export class ReplyHandler extends DefaultHandler implements ReplyHandlerType {
	handler: true
	_modConfigPath: string
	_whiteListPath: string
	groupWhiteList: Array<number>
	friendWhiteList: Array<number>
	mods: { [key: string]: ReplyModType }
	constructor() {
		super()
		this._modConfigPath = path.resolve(
			process.cwd(),
			'configs/ReplyModConfig.yml'
		)
		this._whiteListPath = path.resolve(
			process.cwd(),
			'configs/ReplyWhiteList.yml'
		)
		this.handler = true
		this.groupWhiteList = []
		this.friendWhiteList = []
		this.mods = {}
	}
	load() {
		this.loadHandlerWhiteList()
	}
	/**
	 * 监听ChatMessage消息，然后从这里开始处理
	 * @param msg
	 */
	watchChatMessage(msg: MessageType.ChatMessage): void {
		//处理器白名单拦截
		if (!this.validateWhiteList(msg)) {
			this.log.info('非白名单' + this.msgLog(msg))
			return
		}
		this.log.info(this.msgLog(msg))
		// 处理回复
		let reply = {
			always: false,
			whiteList: false,
			keyword: false,
			canReply: false,
		}
		for (const item of Object.entries(this.mods)) {
			if (item[1].isAlwaysReply) {
				reply.always = true
			}
			// 白名单拦截 如果是always 就不用判断，直接走就行了
			if (!reply.always || this.filterWhiteList(item[1], msg)) {
				reply.whiteList = true
			}
			//拦截关键词 如果whiteList是true说明不是always。如果是false就说明没有通过白名单
			if (reply.whiteList && this.filterKeywordList(item[1], msg)) {
				reply.keyword = true
			}

			if (reply.always || (reply.whiteList && reply.keyword)) {
				reply.canReply = true
			}
			if (reply.canReply) {
				this.replyChatMessage(msg, item[1].reply(msg.plain, this))
			}
		}
	}
	/**
	 *
	 * @param msg 接受到的消息
	 * @param sendMsg 处理好的MessageChain或者stirng
	 */
	replyChatMessage(
		msg: MessageType.ChatMessage,
		sendMsg: MessageType.MessageChain | string
	): void {
		msg.reply(sendMsg).then(() => {
			this.log.info(`我回复->${sendMsg}`)
		})
	}
	/**
	 * 加载白名单列表
	 */
	async loadHandlerWhiteList() {
		this.log.info('正在加载处理器白名单列表')
		const exist = fs.existsSync(this._whiteListPath)
		try {
			const whiteListTemplate: ReplyWhiteListType = {
				groupWhiteList: [],
				friendWhiteList: [],
			}
			const whiteList = yaml.dump(whiteListTemplate)
			if (!exist) {
				fs.writeFile(this._whiteListPath, whiteList, 'utf-8', err => {
					if (err) {
						throw err
					}
				})
			} else {
				const res = await fs.promises.readFile(this._whiteListPath, 'utf-8')
				const originWhiteList = yaml.load(res) as ReplyWhiteListType
				const { groupWhiteList, friendWhiteList } =
					originWhiteList === undefined
						? ({} as ReplyWhiteListType)
						: originWhiteList

				const writeListTemplate: ReplyWhiteListType = {
					groupWhiteList: groupWhiteList === undefined ? [] : groupWhiteList,
					friendWhiteList: friendWhiteList === undefined ? [] : friendWhiteList,
				}
				fs.writeFile(
					this._whiteListPath,
					yaml.dump(writeListTemplate),
					'utf-8',
					err => {
						if (err) {
							throw err
						}
					}
				)
				this.friendWhiteList = writeListTemplate.friendWhiteList
				this.groupWhiteList = writeListTemplate.groupWhiteList

				this.loadMod()
			}
		} catch (err) {
			throw new Error('处理器白名单列表加载失败')
		}
		this.log.success('处理器白名单列表加载成功')
	}
	/**
	 * 加载mod
	 */
	async loadMod() {
		try {
			const modsDir = fs.existsSync(
				path.resolve(path.resolve(process.cwd(), 'src/mods'))
			)
			if (!modsDir) {
				fs.promises.mkdir(path.resolve(process.cwd(), 'src/mods'))
			}
			const modFile = path.resolve(process.cwd(), 'src/mods/index.ts')
			const exist = fs.existsSync(modFile)
			if (!exist) {
				fs.writeFile(
					path.join(modFile),
					`export {Reply} from './Reply/Reply'//在这个文件中导出所有mod函数，你可以使用你的结构来导出。`,
					'utf-8',
					err => {
						if (err) {
							throw err
						}
					}
				)
				const data = template
				await fs.promises.mkdir(
					path.resolve(process.cwd(), 'src', 'mods', 'Reply')
				)
				await fs.promises.writeFile(
					path.resolve(process.cwd(), 'src/mods/Reply/Reply.ts'),
					data
				)
			}
		} catch (err) {
			throw err
		}

		const templateMod = require(path.resolve(
			process.cwd(),
			'src',
			'mods',
			'index.ts'
		))

		for (const item of Object.entries(templateMod)) {
			const key = item[0]
			const mod = templateMod[key]()
			const isReplyMod = this.isOfType<ReplyModType>(mod, 'replyHandler')
			if (isReplyMod) {
				this.mods[key] = mod
			}
		}
		if (Object.keys(this.mods).length === 0) {
			this.log.info('没有任何mod被使用')
		} else {
			const avaMod: string[] = []
			const keys = Object.keys(this.mods)
			keys.forEach(key => {
				avaMod.push(this.mods[key].name)
			})
			this.log.success(`模块[${avaMod.join(',')}]加载成功`)
		}
		this.createConfigFile()
	}
	/**
	 * 验证白名单
	 */
	validateWhiteList(msg: MessageType.ChatMessage): boolean {
		const type = msg.type
		switch (type) {
			case 'GroupMessage':
				return this.groupWhiteList.includes(msg.sender.group.id)
			case 'FriendMessage':
				return this.friendWhiteList.includes(msg.sender.id)
			case 'TempMessage':
				return false
		}
	}
	/**
	 * 生成配置文档
	 */
	async createConfigFile() {
		try {
			this.log.info('正在生成配置文件')
			//读取原有配置
			const exist = fs.existsSync(this._modConfigPath)
			let originConfig: ReplyModConfigType = {} as ReplyModConfigType
			let config: ReplyModConfigType = {} as ReplyModConfigType
			if (exist) {
				config = yaml.load(
					await fs.promises.readFile(this._modConfigPath, 'utf-8')
				) as ReplyModConfigType
			} else {
				this.log.info('首次创建，完成后可根据配置文件修改相应配置。')
			}
			if (config !== undefined) {
				originConfig = config
			}

			// 合并配置
			const configTemplate: ReplyModConfigType = {} as ReplyModConfigType

			for (const [key, obj] of Object.entries(this.mods)) {
				// 配置写入的模板
				configTemplate[key] = {
					name: obj.name,
					isAlwaysReply:
						originConfig[key] && originConfig[key].isAlwaysReply
							? originConfig[key].isAlwaysReply
							: obj.isAlwaysReply === false
							? false
							: undefined,
					keywords:
						originConfig[key] && originConfig[key].keywords
							? originConfig[key].keywords
							: [],
					whiteList:
						originConfig[key] && originConfig[key].whiteList
							? originConfig[key].whiteList
							: [],
					keywordRule:
						originConfig[key] && originConfig[key].keywordRule
							? originConfig[key].keywordRule
							: [],
				}
			}

			const configContent = yaml.dump(configTemplate)
			// 写入配置
			fs.writeFile(this._modConfigPath, configContent, 'utf-8', err => {
				if (err) {
					throw err
				}
			})

			this.log.success('配置文件创建完成')
			this.loadWhiteList(configTemplate)
			this.loadKeywordConfig(configTemplate)
		} catch (err) {
			throw new Error('配置文档生成失败')
		}
	}
	/**
	 * 给现有的mod加载白名单
	 */
	loadWhiteList(configTemplate: ReplyModConfigType) {
		this.log.info('正在加载命令白名单列表')
		for (const [key, obj] of Object.entries(this.mods)) {
			const config = configTemplate[key]
			if (config.whiteList !== undefined) {
				obj.isAlwaysReply = config.isAlwaysReply
				obj.whiteList = config.whiteList
			}
		}
		this.log.success('命令白名单列表加载成功')
	}

	loadKeywordConfig(configTemplate: ReplyModConfigType) {
		this.log.info('正在加载关键词配置')
		for (const [key, obj] of Object.entries(this.mods)) {
			const config = configTemplate[key]
			if (config.keywords !== undefined) {
				obj.keywords = config.keywords
			}
			if (config.keywordRule !== undefined) {
				obj.keywordRule = config.keywordRule.map(regList => {
					return new RegExp(regList, 'g')
				})
			}
		}
		this.log.success('关键词配置加载成功')
	}
	/**
	 * 过滤信息。根据白名单列表
	 */
	filterWhiteList(modInstance: ReplyModType, msg: MessageType.ChatMessage) {
		const type = msg.type
		let number

		switch (type) {
			case 'FriendMessage':
				number = msg.sender.id
				break
			case 'GroupMessage':
				number = msg.sender.group.id
				break
		}
		if (number === undefined) {
			return false
		} else {
			return modInstance.whiteList.includes(number)
		}
	}
	filterKeywordList(modInstance: ReplyModType, msg: MessageType.ChatMessage) {
		let isKeyword = []
		// 判断是否有keywordRule
		if (modInstance.keywordRule !== undefined) {
			isKeyword.push(
				modInstance.keywordRule.some(reg => {
					return reg.test(msg.plain)
				})
			)
		}
		isKeyword.push(modInstance.keywords.includes(msg.plain))
		return isKeyword.includes(true)
	}
}

const template = `
import { MessageType } from 'mirai-ts'
import { ReplyModType } from 'mirai-circlebot'

export const Reply = (): ReplyModType => {
	const name = '测试'
	const isAlwaysReply: boolean = false
	const keywords: string[] = []
	const keywordRule: RegExp[] = []
	const whiteList: number[] = []

	const reply = (msg: MessageType.MessageChain | string) => {
		return '现在时间：' + new Date().toLocaleString()
	}
	return {
		name,
		keywords,
		whiteList,
		replyHandler: true,
		reply,
		isAlwaysReply,
		keywordRule,
	}
}
`
