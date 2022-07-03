import Mirai, { Logger } from 'mirai-ts'
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
}
