# Mirai应用层

## 快速上手
***
**找到src/mods/ReplyHandler文件夹，其中的ReplySimple是写好的一个mod，他被ReplyHandler下的index.ts导出，因此你可以依靠这个模板来创建你的mod**
1. 在ReplyHandler中新建一个文件夹，作为你的mod的文件夹
2. 在文件夹下创建一个Xxx.ts，这就是你的mod的入口
3. 在其中创建一个函数，注意：**这个函数的返回值请实现于ReplyModType这个类型。**
4. 接下来请你根据Test.ts中的模板来实现name,keywords,reply...等函数，并将它们返回。

这样 你已经完成了一个新的mod的配置，尝试使用npm run dev命令来使用开发环境运行这个项目。

### 尝试自定义mod
**尝试修改mod中的reply函数的返回值，这个返回值返回的数据最终将会成为qq消息回复的内容。** 你可以返回一个string类型或者MessageType.MessageChain类型的数据。Message类中包含的内容你都可以使用在MessageType.MessageChain中，可以组合成不同的消息内容。更多详细请你去**

```
export const Reply = (): ReplyModType => {
	const name = '简单回复'
	const keywords: string[] = []

	const reply = (msg: MessageType.MessageChain | string) => {
		return [Message.Plain('test')] as MessageType.MessageChain
	}
	return {
		name,
		keywords,
		replyHandler: true,
		reply,
	}
}
```
