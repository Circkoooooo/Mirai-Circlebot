import { MessageType } from 'mirai-ts'
import { ReplyHandler } from '../../handle'
import { ReplyModType } from '../../types/ModType'

export const Reply = (): ReplyModType => {
	const name = '测试'
	const isAlwaysReply: boolean = false
	const keywords: string[] = []
	const keywordRule: RegExp[] = []
	const whiteList: number[] = []

	const reply = (
		msg: MessageType.MessageChain | string,
		handler: ReplyHandler | undefined
	) => {
		console.log(handler)
		return '现在时间：' + new Date().toLocaleString()
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
