import { MessageType } from 'mirai-ts'
import { ReplyConfigType } from '../../types/ReplyConfigType'
import { DefaultHandler } from './DefaultHandler'
import * as replyModList from '../mods/ReplyHandler'
import { ReplyModType } from '../../types/HandlerType'

export class ReplyHandler extends DefaultHandler {
	handler: true
	groupWhiteList: Array<number>
	friendWhiteList: Array<number>
	mods: Array<ReplyModType>

	constructor(replyConfig: ReplyConfigType) {
		super()
		this.handler = true
		const { groupWhiteList, friendWhiteList } = replyConfig
		this.groupWhiteList = groupWhiteList
		this.friendWhiteList = friendWhiteList
		this.mods = []
		this.loadMod()
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

		this.mods.forEach(mod => {
			this.replyChatMessage(msg, mod.reply(msg.plain))
		})
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
		for (const [_, obj] of Object.entries(replyModList)) {
			const mod = obj()
			const isReplyMod = this.isOfType<ReplyModType>(mod, 'replyHandler')
			if (isReplyMod) {
				this.mods.push(mod)
			}
		}
		if (this.mods.length === 0) {
			this.log.info('没有任何mod被使用')
		} else {
			const avaMod: string[] = []
			this.mods.forEach(mod => {
				avaMod.push(mod.name)
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
}
