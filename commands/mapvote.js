exports.run = async (client, message, args) => {
	if (message.channel.id !== client.config.host_channel_id) {
		// If the command isn't ran in the host channel, do nothing.
		return;
	}

	// Get customRole for pinging later
	const customRole = message.guild.roles.find(
		findRole => findRole.id === client.config.custom_role_id
	);

	const emojiCharacters = require('../emojiCharacters.js');
	const host_channel = client.channels.get(client.config.host_channel_id);
	const games_channel = client.channels.get(client.config.games_channel_id);
	const timer = client.config.default_timer;

	// Set up the message as an embed, ready to post
	const title = 'Vote for map!';
	const description = 'Please vote on the map for the next game!';
	const winValue = 'The winning map was:';
	const footerText = '© DanBennett';

	const mapVoteMessage = {
		color: 0x3366ff,
		title: `${title}`,
		description: `${description}`,
		fields: [
			{
				name: 'Choose a reaction',
				value: `${emojiCharacters['Erangel']} for Erangel 
				\u200B${emojiCharacters['Miramar']} for Miramar
				\u200B${emojiCharacters['Sanhok']} for Sanhok
				\u200B${emojiCharacters['Vikendi']} for Vikendi`,
			},
			{
				name: 'Vote will close in:',
				value: `${timer} minute(s)`,
			},
		],
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL,
			text: `${footerText}`,
		},
	};

	try {
		await games_channel
			.send({ embed: mapVoteMessage })
			.then(async embedMessage => {
				await embedMessage.react(emojiCharacters['Erangel']);
				await embedMessage.react(emojiCharacters['Miramar']);
				await embedMessage.react(emojiCharacters['Sanhok']);
				await embedMessage.react(emojiCharacters['Vikendi']);
				if (client.config.custom_role_ping == true) {
					customRole
						.setMentionable(true, 'Role needs to be pinged')
						.catch(console.error);
					games_channel.send(customRole + ' - get voting!');
					setTimeout(function() {
						customRole
							.setMentionable(
								false,
								'Role no longer needs to be pinged'
							)
							.catch(console.error);
					}, 20000);
				}
				setTimeout(function() {
					const reactions = embedMessage.reactions.array();
					let reactionID;
					let maxCount = 0;
					for (let i = 0; i < reactions.length; i++) {
						if (reactions[i].count > maxCount) {
							maxCount = reactions[i].count;
							reactionID = i;
						}
					}
					const mapResultEmoji = reactions[reactionID]._emoji;

					const mapResult = {
						color: 0x009900,
						title: `${title}`,
						fields: [
							{
								name: 'Choices:',
								value: `${
									emojiCharacters['Erangel']
								} for Erangel 
								\u200B${emojiCharacters['Miramar']} for Miramar
								\u200B${emojiCharacters['Sanhok']} for Sanhok
								\u200B${emojiCharacters['Vikendi']} for Vikendi`,
							},
							{
								name: `${winValue}`,
								value: `${mapResultEmoji}`,
							},
						],
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: `${footerText}`,
						},
					};

					embedMessage.delete();
					games_channel.send({ embed: mapResult });
					if (client.config.host_channel_messages === true) {
						host_channel.send({ embed: mapResult });
					}
				}, client.config.default_timer * 60 * 1000);
			});
	}
	catch (error) {
		console.log(`${error}`);
	}

	// Post the message and set up the reactions
};
