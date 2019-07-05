exports.run = async (client, message, args) => {
	if (message.channel.id !== client.config.host_channel_id) {
		// If the command isn't ran in the host channel, do nothing.
		return;
	}
	console.log(args);
	const perspective_vote = args;
	const emojiCharacters = require('../emojiCharacters.js');
	const host_channel = client.channels.get(client.config.host_channel_id);
	const games_channel = client.channels.get(client.config.games_channel_id);

	// Set up the message as an embed, ready to post
	const title = 'Vote for perspective!';
	const description = 'Please vote on the perspective for the next game!';
	const winValue = 'The winning perspective was:';
	const footerText = '© DanBennett';

	const perspectiveVote = {
		color: 0x3366ff,
		title: `${title}`,
		description: `${description}`,
		fields: [
			{
				name: 'Choose a reaction',
				value: `${emojiCharacters[1]} for FPP \n${
					emojiCharacters[3]
				} for TPP`,
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

	console.log('perspective_vote is = ') + perspective_vote;

	try {
		await games_channel
			.send({ embed: perspectiveVote })
			.then(async embedMessage => {
				await embedMessage.react(emojiCharacters[1]);
				await embedMessage.react(emojiCharacters[3]);
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
					const perspectiveResultEmoji = reactions[reactionID]._emoji;

					const perspectiveResult = {
						color: 0x009900,
						title: `${title}`,
						description: '',
						fields: [
							{
								name: `${winValue}`,
								value: `${perspectiveResultEmoji}`,
							},
						],
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: `${footerText}`,
						},
					};

					embedMessage.delete();
					games_channel.send({ embed: perspectiveResult });
					host_channel.send(
						`${winValue} ${reactions[reactionID]._emoji}`
					);
				}, client.config.default_timer * 60 * 1000);
			});
	}
	catch (error) {
		console.log(`${error}`);
	}

	// Post the message and set up the perspectives
};
