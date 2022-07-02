import { Mirai, MiraiApiHttpSetting, MiraiInstance } from 'mirai-ts'

interface User {
	qq: number
}

export class Bot {
	mirai: MiraiInstance
	user: User

	constructor(userConfig: User, httpApiSetting: MiraiApiHttpSetting) {
		// const setting = this.bot.
		this.mirai = new Mirai(httpApiSetting)
		this.user = userConfig
		console.log(this.mirai)
	}
}
