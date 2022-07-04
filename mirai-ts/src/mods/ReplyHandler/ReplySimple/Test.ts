import { MessageType } from 'mirai-ts'
import { ReplyModType } from '../../../../types/HandlerType'

export const Test = (): ReplyModType => {
	const name = '测试'
	const keywords: string[] = []
	const whiteList: number[] = []

	const reply = (msg: MessageType.MessageChain | string) => {
		return msg + 'test'
	}
	return {
		name,
		keywords,
		whiteList,
		replyHandler: true,
		reply,
	}
}
