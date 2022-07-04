import { MessageType } from 'mirai-ts'
import { ReplyConfigType } from '../../types/ReplyConfigType'
import { DefaultHandler } from './DefaultHandler'
import * as replyModList from '../mods/ReplyHandler'
import { ReplyModConfigType, ReplyModType } from '../../types/HandlerType'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
export class ReplyHandler extends DefaultHandler {
	handler: true
	groupWhiteList: Array<number>
	friendWhiteList: Array<number>
	mods: { [key: string]: ReplyModType }
	constructor(replyConfig: ReplyConfigType) {
		super()
		this.handler = true
		const { groupWhiteList, friendWhiteList } = replyConfig
		this.groupWhiteList = groupWhiteList
		this.friendWhiteList = friendWhiteList
		this.mods = {}
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
		for (const [key, obj] of Object.entries(this.mods)) {
			if (!this.filterWhiteList(obj, msg)) {
				continue
			}
			//拦截关键词
			if (!this.filterKeywordList(obj, msg)) {
				continue
			}
			this.replyChatMessage(msg, obj.reply(msg.plain))
		}
	}
	replyChatMessage(
		msg: MessageType.ChatMessage,
		sendMsg: MessageType.MessageChain | string
	): void {
		msg.reply(sendMsg).then(item => {
			this.log.info(`我回复->${sendMsg}`)
		})
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
			const targetPath = path.resolve(
				__dirname,
				'../../config/ReplyModConfig.yml'
			)

			//读取原有配置
			const exist = fs.existsSync(targetPath)
			let originConfig: ReplyModConfigType = {} as ReplyModConfigType
			if (exist) {
				originConfig = yaml.load(
					await fs.promises.readFile(targetPath, 'utf-8')
				) as ReplyModConfigType
			} else {
				this.log.info('首次创建，完成后可根据配置文件修改相应配置。')
			}

			// 合并配置
			const configTemplate: ReplyModConfigType = {} as ReplyModConfigType

			for (const [key, obj] of Object.entries(this.mods)) {
				// 配置写入的模板
				configTemplate[key] = {
					name: obj.name,
					keywords:
						originConfig[key]?.keywords === undefined
							? []
							: originConfig[key].keywords,
					whiteList:
						originConfig[key]?.whiteList === undefined
							? []
							: originConfig[key].whiteList,
					keywordRule:
						originConfig[key]?.keywordRule === undefined
							? []
							: originConfig[key].keywordRule,
				}
			}

			let configContent = yaml.dump(configTemplate)
			// 写入配置
			fs.writeFile(targetPath, configContent, 'utf-8', err => {
				if (err) {
					throw err
				}
			})

			this.log.success('命令配置文件创建完成')
			this.loadWhiteList(configTemplate)
			this.loadKeywordConfig(configTemplate)
		} catch (err) {
			throw err
		}
	}
	/**
	 * 给现有的mod加载白名单
	 */
	loadWhiteList(configTemplate: ReplyModConfigType) {
		this.log.info('正在加载命令白名单列表')
		for (const [key, obj] of Object.entries(this.mods)) {
			obj.whiteList = configTemplate[key].whiteList
		}
		this.log.success('命令白名单列表加载成功')
	}
	loadKeywordConfig(configTemplate: ReplyModConfigType) {
		this.log.info('正在加载关键词配置')
		for (const [key, obj] of Object.entries(this.mods)) {
			obj.keywords = configTemplate[key].keywords
			obj.keywordRule = configTemplate[key].keywordRule?.map(regList => {
				return new RegExp(regList, 'g')
			})
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
