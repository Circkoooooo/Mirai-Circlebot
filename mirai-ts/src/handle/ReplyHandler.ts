import { MessageType } from 'mirai-ts'
import { DefaultHandler } from './DefaultHandler'

export class ReplyHandler extends DefaultHandler {
	constructor() {
		super()
	}
	watch(msg: MessageType.ChatMessage): void {
		console.log(1)
	}
}
