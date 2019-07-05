exports.run = async (client, message) => {
	const configPrefix = client.config.prefix;

	if (
		!message.member.roles.some(
			role => role.id === client.config.host_role_id
		)
	) {
		try {
			message.channel.send({
				embed: {
					color: 0x666633,
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL,
						url: 'https://github.com/DanBennettUK/CustomBotJS',
					},
					title: 'Commands for users',
					fields: [
						{
							name: `${configPrefix}help`,
							value: 'lists all commands',
						},
						{
							name: `${configPrefix}ping`,
							value: 'checks Discord API response',
						},
					],
					timestamp: new Date(),
					footer: {
						icon_url: client.user.avatarURL,
						text: '© DanBennett',
					},
				},
			});
		}
		catch (error) {
			console.log(`${error}`);
		}
	}
	else if (
		message.member.roles.some(
			role => role.id === client.config.host_role_id
		)
	) {
		try {
			message.channel.send({
				embed: {
					color: 0x666633,
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL,
						url: 'https://github.com/DanBennettUK/CustomBotJS',
					},
					title: 'Commands for hosts',
					fields: [
						{
							name: `\`${configPrefix}help\``,
							value: 'lists all commands',
							inline: true,
						},
						{
							name: `\`${configPrefix}ping\``,
							value: 'checks Discord API response',
							inline: true,
						},
						{
							name: `\`${configPrefix}squadvote (sqv)\``,
							value:
								'Starts squadvote. \nUsage: `all` for 1-10 \nLeave blank for 1 2 4 8',
							inline: true,
						},
						{
							name: `\`${configPrefix}perspectivevote (pv)\``,
							value: 'Starts perspective vote.',
							inline: true,
						},
						{
							name: `\`${configPrefix}regionvote (rv)\``,
							value: 'Starts region vote',
							inline: true,
						},
						{
							name: `\`${configPrefix}mapvote\``,
							value: 'Starts map vote',
							inline: true,
						},
					],
					timestamp: new Date(),
					footer: {
						icon_url: client.user.avatarURL,
						text: '© DanBennett',
					},
				},
			});
		}
		catch (error) {
			console.log(`${error}`);
		}
	}
};
