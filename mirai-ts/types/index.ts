import { MiraiInstance } from 'mirai-ts'
import { User } from './User'
import { HandlerList, OtherUse } from './UseType'

export interface CircleBot {
	user: User
	mirai: MiraiInstance | null
	handlerList: Array<HandlerList>
	OtherUse: Array<OtherUse>
	isDev: boolean
	use: (useMod: HandlerList | OtherUse) => void
}
