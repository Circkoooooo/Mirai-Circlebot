import Mirai from 'mirai-ts'
import { DefaultHandlerType } from '../../types/HandlerType'
import { MessageType } from 'mirai-ts'

export abstract class DefaultHandler implements DefaultHandlerType {
	handler: true
	mirai: Mirai | null

	constructor() {
		this.mirai = null
		this.handler = true
	}
	bind(miraiInstance: Mirai) {
		this.mirai = miraiInstance
	}
	start() {
		this.mirai?.on('message', msg => {
			console.log(msg)
		})
		this.mirai?.listen()
	}
	abstract watch(msg: MessageType.ChatMessage): void
}
