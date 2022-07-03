import { Logger, MessageType } from 'mirai-ts'
export type DefaultHandlerType = {
	readonly handler: true
	log: Logger
	watchChatMessage: (msg: MessageType.ChatMessage) => void
	replyChatMessage: (
		msg: MessageType.ChatMessage,
		sendMsg: MessageType.MessageChain | string
	) => void
}
export interface ReplyHandlerType extends DefaultHandlerType {
	groupWhiteList: Array<number>
	friendWhiteList: Array<number>
	loadMod: () => void
	validateWhiteList: (msg: MessageType.ChatMessage) => boolean
	createConfigFile: () => void
	mods: { [key: string]: () => ReplyModType }
}
/**
 * 暴露出来用于mod
 */
export type ReplyModType = {
	readonly replyHandler: true
	name: string
	keywords: string[]
	reply: (
		msg: MessageType.MessageChain | string
	) => MessageType.MessageChain | string
}
