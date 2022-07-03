import { MessageType } from 'mirai-ts'
import { ReplyModType } from '../../../../types/HandlerType'

export const Test = (): ReplyModType => {
	const name = '测试'
	const keywords: string[] = []

	const test = () => {
		console.log(2)
	}
	const reply = (msg: MessageType.MessageChain | string) => {
		return msg + 'testtest'
	}

	return {
		name,
		keywords,
		replyHandler: true,
		test,
		reply,
	}
}
