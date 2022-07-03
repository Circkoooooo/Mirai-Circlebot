import { ReplyModType } from '../../../../types/HandlerType'

export const Test = (): ReplyModType => {
	const name = '测试'
	const keywords: string[] = []

	const test = () => {
		console.log(1)
	}
	return {
		name,
		keywords,
		replyHandler: true,
		test,
	}
}
