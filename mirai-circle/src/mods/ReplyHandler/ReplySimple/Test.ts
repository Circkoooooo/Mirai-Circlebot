import { Message, MessageType } from 'mirai-ts'
import { ReplyModType } from '../../../types/HandlerType'

export const Test = (): ReplyModType => {
	const name = '测试'
	const isAlwaysReply: boolean = false
	const keywords: string[] = []
	const keywordRule: RegExp[] = []
	const whiteList: number[] = []

	const reply = (msg: MessageType.MessageChain | string) => {
		return [Message.At(2389451262), Message.Plain('你好')]
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
