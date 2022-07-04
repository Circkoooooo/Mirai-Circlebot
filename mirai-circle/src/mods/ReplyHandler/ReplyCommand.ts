export type CommandListConfig = {
	[key: string]: {
		name: string
		isAlwaysExcute: true
	}
}

export const commandList: CommandListConfig = {
	Reply: {
		name: '回复',
		isAlwaysExcute: true,
	},
}
