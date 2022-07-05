import { MessageType } from 'mirai-ts'
import { ReplyHandler } from '../handle'

/**
 * 用于mod类实现
 */
export type ReplyModType = {
	/**
	 * 处理器必要的标识。一定需要设置
	 */
	readonly replyHandler: true
	/**
	 * mod的名字。可用于生成菜单等等的命名。
	 * 为了规范文档可读性，统一要求增加name
	 */
	name: string
	/**
	 * 如果实现了这个参数，配置文档中会自动添加进去。
	 * 如果为true，那么这个mod会处理任何消息
	 */
	isAlwaysReply?: boolean
	/**
	 * mod的白名单。不区分群和好友。
	 */
	whiteList: number[]
	/**
	 * 当isAlwaysReply不为true，并且消息发送者在白名单内，触发关键词就会处理消息。
	 */
	keywords: string[]
	/**
	 * 正则表达式。在配置文件中忽略前后的/符号，默认全局匹配。如/帮助|菜单/ 直接写成 帮助|菜单
	 */
	keywordRule?: RegExp[]
	/**
	 * msg:接受到的消息
	 * 传入的Handler的实例
	 */
	reply: (
		handlerInstance: ReplyHandler,
		msg: MessageType.ChatMessage,
		msgText?: MessageType.MessageChain | string
	) => void
}
