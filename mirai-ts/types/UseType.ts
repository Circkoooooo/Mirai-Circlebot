import { ReplyHandlerType } from './HandlerType'

// 用于管理可用类型的HandlerList
export type HandlerList = ReplyHandlerType

/**
 * 其他的use类型
 */
export type OtherUse = {
	readonly OtherHandler?: true
}

export type UseType = HandlerList | OtherUse
