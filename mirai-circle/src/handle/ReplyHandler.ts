import { MessageType } from 'mirai-ts'
import { DefaultHandler } from './DefaultHandler'
import * as replyModList from '../mods/ReplyHandler'
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
		this._modConfigPath = path.resolve('configs/ReplyModConfig.yml')
		this._whiteListPath = path.resolve('configs/ReplyWhiteList.yml')
		this.handler = true
		this.groupWhiteList = []
		this.friendWhiteList = []
		this.mods = {}
		this.loadHandlerWhiteList()
		this.loadMod()
		this.createConfigFile()
	}
	/**
	 * 监听ChatMessage消息，然后从这里开始处理
	 * @param msg
	 */
	watchChatMessage(msg: MessageType.ChatMessage): void {
		// 这里需要执行的逻辑有：白名单拦截，提取命令文本，通过mod处理文本，..
		if (!this.validateWhiteList(msg)) {
			this.log.info('非白名单' + this.msgLog(msg))
			return
		}
		this.log.info(this.msgLog(msg))
		for (const item of Object.entries(this.mods)) {
			if (!this.filterWhiteList(item[1], msg)) {
				continue
			}
			//拦截关键词
			if (!this.filterKeywordList(item[1], msg)) {
				continue
			}
			this.replyChatMessage(msg, item[1].reply(msg.plain))
		}
	}
	replyChatMessage(
		msg: MessageType.ChatMessage,
		sendMsg: MessageType.MessageChain | string
	): void {
		msg.reply(sendMsg).then(() => {
			this.log.info(`我回复->${sendMsg}`)
		})
	}
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
			}
		} catch (err) {
			throw new Error('处理器白名单列表加载失败')
		}
		this.log.success('处理器白名单列表加载成功')
	}
	/**
	 * 加载mod
	 */
	loadMod() {
		for (const [name, obj] of Object.entries(replyModList)) {
			const mod = obj()
			const isReplyMod = this.isOfType<ReplyModType>(mod, 'replyHandler')
			if (isReplyMod) {
				this.mods[name] = mod
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

			this.log.success('命令配置文件创建完成')
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
