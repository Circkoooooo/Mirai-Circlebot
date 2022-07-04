import { Logger, MiraiInstance } from 'mirai-ts'
import { HandlerList, OtherUse } from './UseType'

export interface CircleBot {
	qq: number
	mirai: MiraiInstance | null
	handlerList: Array<HandlerList>
	OtherUse: Array<OtherUse>
	isDev?: boolean
	log: Logger
	use: (useMod: HandlerList | OtherUse) => void
}
