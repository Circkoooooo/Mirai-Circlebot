import { Logger, MessageType, EventType, MiraiInstance } from 'mirai-ts'
import { ReplyModType } from './ModType'
/**
 * 消息|戳一戳
 */
export type HandlerType = 'Message' | 'Nudge'

export interface DefaultHandlerType {
	readonly handler: true
	mirai:MiraiInstance
	type: HandlerType
	_targetPath?: string
	log: Logger
	groupWhiteList: Array<number>
	friendWhiteList: Array<number>
	load(
		friendWhitelist: number[],
		groupWhiteList: number[],
		mirai: MiraiInstance
	): void
	send(
		msg: MessageType.ChatMessage,
		sendMsg: MessageType.MessageChain | string
	): void
	watchChatMessage(msg: MessageType.ChatMessage): void
	watchNudge(event: EventType.NudgeEvent): void
}
/**
 * 消息处理器
 */
export interface ReplyHandlerType extends DefaultHandlerType {
	mods: { [key: string]: ReplyModType }
	loadMod(): void
	validateWhiteList(msg: MessageType.ChatMessage): boolean
	createConfigFile(): void
}

/**
 * 戳一戳处理器
 */
export interface NudgeHandlerType extends DefaultHandlerType {}
