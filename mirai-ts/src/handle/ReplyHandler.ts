import { Logger, MessageType } from 'mirai-ts'
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
	watchChatMessage(msg: MessageType.ChatMessage): void {
		console.log(this.mods)
	}
	replyChatMessage(msg: MessageType.ChatMessage): void {}

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
	validateWhiteList(msg: MessageType.ChatMessage) {
		const type = this.getMsgType(msg)
		switch (type) {
			case 'GroupMessage':
				console.log('group')
				break
			case 'FriendMessage':
				console.log('friend')
				break
			case 'TempMessage':
				console.log('temp')
				break
		}
	}
	/**
	 * 得到消息类型
	 * @param msg
	 * @returns
	 */
	getMsgType(
		msg: MessageType.ChatMessage
	): 'GroupMessage' | 'TempMessage' | 'FriendMessage' {
		return msg.type
	}
}
