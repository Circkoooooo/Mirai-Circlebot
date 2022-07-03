import { ReplyModType } from './HandlerType'

export type ReplyConfigType = {
	groupWhiteList: Array<number>
	friendWhiteList: Array<number>
	mods: Array<ReplyModType>
}
