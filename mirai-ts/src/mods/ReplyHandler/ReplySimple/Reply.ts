import { Message, MessageType } from 'mirai-ts'
import { ReplyModType } from '../../../../types/HandlerType'

export const Reply = (): ReplyModType => {
	const name = '简单回复'
	const keywords: string[] = []

	const test = () => {
		console.log(1)
	}
	const reply = (msg: MessageType.MessageChain | string) => {
		return [Message.Plain('123')] as MessageType.MessageChain
	}
	return {
		name,
		keywords,
		replyHandler: true,
		test,
		reply,
	}
}
