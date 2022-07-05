import { MessageType } from 'mirai-ts'
import { ReplyHandler } from '../handle'

/**
 * 用于mod类实现
 */
export type ReplyModType = {
	readonly replyHandler: true
	name: string
	isAlwaysReply?: boolean
	keywords: string[]
	keywordRule?: RegExp[]
	whiteList: number[]
	/**
	 * msg:接受到的消息
	 * 传入的Handler的实例
	 */
	reply: (
		msg: MessageType.MessageChain | string,
		handlerInstance?: ReplyHandler
	) => MessageType.MessageChain | string
}
