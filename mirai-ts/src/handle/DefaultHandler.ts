import  { Logger } from 'mirai-ts'
import { DefaultHandlerType } from '../../types/HandlerType'
import { MessageType } from 'mirai-ts'

export abstract class DefaultHandler implements DefaultHandlerType {
	handler: true
	log: Logger

	constructor() {
		this.handler = true
		this.log = new Logger()
	}
	abstract watchChatMessage(msg: MessageType.ChatMessage): void
	abstract replyChatMessage(
		msg: MessageType.ChatMessage,
		sendMsg: MessageType.MessageChain | string
	): void

	isOfType<T>(use: any, propertyToCheckFor: keyof T): use is T {
		return (use as T)[propertyToCheckFor] !== undefined
	}
	/**
	 * 打印 接收到的信息
	 * @param msg
	 * @returns
	 */
	msgLog(msg: MessageType.ChatMessage) {
		const type = msg.type
		const formatMsgChain = (msgChain: MessageType.MessageChain) => {
			const source = msgChain.filter(item => {
				return item.type !== 'Source' && item.type !== 'Plain'
			})
			return source.length === 0 ? `` : `包含${source.length}个非文本内容`
		}
		switch (type) {
			case 'FriendMessage':
				return `[好友：${msg.sender.nickname}]：${msg.plain} ${formatMsgChain(
					msg.messageChain
				)}`

			case 'GroupMessage':
				return `[群：${msg.sender.group.id}]：${msg.plain} ${formatMsgChain(
					msg.messageChain
				)}`
			case 'TempMessage':
				return ''
		}
	}
}
