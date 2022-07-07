import { MessageType } from 'mirai-ts'
import { ReplyHandler } from '../../handle'
import { ReplyModType } from '../../types/ModType'

/**
 *
 * @returns 一些配置可以根据ReplyModType来查看
 */
export const Reply = (): ReplyModType => {
	const name = '测试'
	const isAlwaysReply: boolean = false
	const keywords: string[] = []
	const keywordRule: RegExp[] = []
	const whiteList: number[] = []

	const reply = (
		handler: ReplyHandler,
		rawMsg: MessageType.ChatMessage,
		msg?: MessageType.MessageChain | string
	) => {
		handler.send(rawMsg, msg + 'hello')
	}

	return {
		name,
		keywords,
		whiteList,
		replyHandler: true,
		reply,
		isAlwaysReply,
		keywordRule,
	}
}
