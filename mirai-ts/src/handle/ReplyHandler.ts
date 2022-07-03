import { MessageType } from 'mirai-ts'
import { ReplyConfigType } from '../../types/ReplyConfigType'
import { DefaultHandler } from './DefaultHandler'
import * as replyModList from '../mods/ReplyHandler'
import { ReplyModType } from '../../types/HandlerType'
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
			this.replyChatMessage(msg, obj.reply(msg.plain))
		}
	}
	replyChatMessage(
		msg: MessageType.ChatMessage,
		sendMsg: MessageType.MessageChain | string
	): void {
		msg.reply(sendMsg)
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
	createConfigFile() {
		const configTemplate: {
			[key: string]: { name: string; keywords: string[] }
		} = {}
		for (const [key, obj] of Object.entries(this.mods)) {
			configTemplate[key] = {
				name: obj.name,
				keywords: obj.keywords,
			}
		}
		try {
			let configContent = yaml.dump(configTemplate)
			fs.writeFile(
				path.resolve(__dirname, '../../config/ReplyModConfig.yml'),
				configContent,
				'utf-8',
				err => {
					if (err) {
						throw err
					}
				}
			)
		} catch (err) {
			throw err
		}
	}
}
