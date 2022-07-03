import { Logger, MessageType } from 'mirai-ts'
export type DefaultHandlerType = {
	readonly handler: true
	log: Logger
	watchChatMessage: (msg: MessageType.ChatMessage) => void
	replyChatMessage: (msg: MessageType.ChatMessage) => void
}
export interface ReplyHandlerType extends DefaultHandlerType {
	groupWhiteList: Array<number>
	friendWhiteList: Array<number>
}
/**
 * 暴露出来用于mod
 */
export type ReplyModType = {
	name: string
	keywords: string[]
	test: () => void
	readonly replyHandler: true
}
