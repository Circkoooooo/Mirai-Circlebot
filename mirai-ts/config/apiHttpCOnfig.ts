import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import { MiraiApiHttpSetting } from 'mirai-ts'

export const resolveApiHttpConfig = (isDev: boolean) => {
	let filePath = ''
	if (!isDev) {
		filePath = '../mcl/config/net.mamoe.mirai-api-http/setting.yml'
	} else {
		filePath = '../mcl_dev/config/net.mamoe.mirai-api-http/setting.yml'
	}
	const setting = yaml.load(
		fs.readFileSync(path.resolve(filePath), 'utf8')
	) as MiraiApiHttpSetting
	return setting
}
