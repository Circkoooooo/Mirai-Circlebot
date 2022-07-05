# Mirai应用层

## 快速上手
```
npm i mirai-circle
```
### 尝试登录
使用mcl登录一个qq

然后在项目的src文件夹下面创建一个index.ts。
```
const bot = new CircleBot(
	已经登录的qq,
	'../mcl/config/net.mamoe.mirai-api-http/setting.yml'
	//这里可以是相对于项目文件夹的路径和绝对路径
)
bot.use(new ReplyHandler())
bot.start()
```
这样，如果mcl登录成功的话，这3行代码就能让你启动mirai-circle。

启动，控制台里面输出一系列不报错的信息，直到**验证成功**的提示出现就说明已经登录成功。

## 配置mod等
在src目录下会自动生成一个mod文件夹和config文件夹。
**前提是你预先没有创建一个名为mod的文件夹。并且mod文件夹中会有个模板mod，你可以依照这个模板来实现mod。**

- **mod文件夹**

index.ts文件作为mod的入口，在这里**导出一个函数即可创建一个mod**，但是这个函数有一些特殊配置
  
- **函数的配置**

这个函数需要实现mirai-circle中的 ReplyHandlerType。其中含有一个必须配置的属性和函数。
