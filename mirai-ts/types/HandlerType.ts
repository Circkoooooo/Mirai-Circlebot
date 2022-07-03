import Mirai, { MessageType } from 'mirai-ts'
export type DefaultHandlerType = {
	readonly handler: true
	mirai: Mirai | null
	start: () => void
	watch: (msg: MessageType.ChatMessage) => void
}
export interface ReplyHandlerType extends DefaultHandlerType {}
