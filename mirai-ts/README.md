# Mirai应用层

# 快速上手
1. src/mods/ReplyHander中创建一个新文件夹，作为你的新mod的名称。
2. 创建一个Xxx.ts的文件作为mod的入口文件，在其中暴露出一个返回类型为ReplyModType的函数，然后在index.ts中引入这个函数。
3. npm run dev启动，注意控制台是否输出，模块[Xxx]加载成功
```
export const Test = (): ReplyModType => {
	const name = '测试'
	const keywords: string[] = []

	const test = () => {
		console.log(1)
	}
	return {
		name,
		keywords,
		replyHandler: true,
		test,
	}
}
```