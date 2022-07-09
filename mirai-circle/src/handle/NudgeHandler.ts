import { MessageType, EventType } from 'mirai-ts'
import { HandlerType, NudgeHandlerType } from '../types/HandlerType'
import { NudgeModType } from '../types/ModType'
import { DefaultHandler } from './DefaultHandler'

/**
 * 戳一戳处理器
 */
export class NudgeHandler extends DefaultHandler implements NudgeHandlerType {
	handler: true
	type: HandlerType
	nudgeMod: NudgeModType
	constructor(nudgeMod: NudgeModType) {
		super()
		this.type = 'Nudge'
		this.handler = true
		this.nudgeMod = nudgeMod
	}
	send(msg: MessageType.ChatMessage, sendMsg: MessageType.MessageChain): void {}
	watchNudge(event: EventType.NudgeEvent): void {
		this.nudgeMod.reply(this, event)
	}
}
