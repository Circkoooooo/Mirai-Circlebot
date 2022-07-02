import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { MiraiApiHttpSetting } from 'mirai-ts'
import { Bot } from './src/Instance/Bot'
// setting 可直接读取 setting.yml 或参考 `src/types/setting.ts`
const setting = yaml.load(
	fs.readFileSync(
		path.resolve(
			__dirname,
			'../mcl/config/net.mamoe.mirai-api-http/setting.yml'
		),
		'utf8'
	)
) as MiraiApiHttpSetting

// const user = {
// 	qq: LoginConfig.qq,
// } as User

const bot = new Bot({ qq: 1054081929 }, setting)
// bot.start()