import { MessageType } from 'mirai-ts'

/**
 * 用于mod类实现
 */
export interface ReplyModType {
	readonly replyHandler: true
	name: string
	isAlwaysReply?: boolean
	keywords: string[]
	keywordRule?: RegExp[]
	whiteList: number[]
	reply: (
		msg: MessageType.MessageChain | string
	) => MessageType.MessageChain | string
}
