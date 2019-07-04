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
					color: 3447003,
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL,
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
					color: 3447003,
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL,
					},
					title: 'Commands for hosts',
					fields: [
						{
							name: `\`${configPrefix}help\``,
							value: 'lists all commands',
						},
						{
							name: `\`${configPrefix}ping\``,
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
};
