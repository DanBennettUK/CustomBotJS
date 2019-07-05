exports.run = async (client, message, args) => {
	if (message.channel.id !== client.config.host_channel_id) {
		// If the command isn't ran in the host channel, do nothing.
		return;
	}
	console.log(args);
	const region_vote = args;
	const emojiCharacters = require('../emojiCharacters.js');
	const host_channel = client.channels.get(client.config.host_channel_id);
	const games_channel = client.channels.get(client.config.games_channel_id);

	// Set up the message as an embed, ready to post
	const title = 'Vote for region!';
	const description = 'Please vote on the region for tonights games!';
	const winValue = 'The winning region was:';
	const footerText = '© DanBennett';

	const regionVoteMessage = {
		color: 0x3366ff,
		title: `${title}`,
		description: `${description}`,
		url: 'https://github.com/DanBennettUK/CustomBotJS',
		fields: [
			{
				name: 'Choose a reaction',
				value: `${emojiCharacters['EU']} for Europe 
				\n${emojiCharacters['NA']} for North America
				\n${emojiCharacters['SEA']} for Southeast Asia
				\n${emojiCharacters['OCE']} for Oceania
				\n${emojiCharacters['KR']} for Korea/Japan`,
			},
			{
				name: 'Vote will close in:',
				value: `${client.config.default_timer} minutes`,
			},
		],
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL,
			text: `${footerText}`,
		},
	};

	console.log('region_vote is = ') + region_vote;

	try {
		await games_channel
			.send({ embed: regionVoteMessage })
			.then(async embedMessage => {
				await embedMessage.react(emojiCharacters['EU']);
				await embedMessage.react(emojiCharacters['NA']);
				await embedMessage.react(emojiCharacters['SEA']);
				await embedMessage.react(emojiCharacters['OCE']);
				await embedMessage.react(emojiCharacters['KR']);
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
					const regionResultEmoji = reactions[reactionID]._emoji;

					const regionResult = {
						color: 0x009900,
						title: `${title}`,
						fields: [
							{
								name: `${winValue}`,
								value: `${regionResultEmoji}`,
							},
						],
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: `${footerText}`,
						},
					};

					embedMessage.delete();
					games_channel.send({ embed: regionResult });
					host_channel.send(
						`${winValue} ${reactions[reactionID]._emoji}`
					);
				}, client.config.default_timer * 60 * 1000);
			});
	}
	catch (error) {
		console.log(`${error}`);
	}

	// Post the message and set up the reactions
};
