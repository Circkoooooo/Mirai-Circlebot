export type ReplyWhiteListType = {
	groupWhiteList: Array<number>
	friendWhiteList: Array<number>
}

/**
 * mod配置模板
 */
export type ReplyModConfigType = {
	[key: string]: {
		name: string
		isAlwaysReply?: boolean
		keywords?: string[]
		keywordRule?: string[] //正则表达式
		whiteList?: number[]
	}
}
