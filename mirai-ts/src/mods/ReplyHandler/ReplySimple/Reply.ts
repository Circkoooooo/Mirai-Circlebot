import {  ReplyModType } from '../../../../types/HandlerType'

export const Reply = (): ReplyModType => {
	const name = '简单回复'
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
