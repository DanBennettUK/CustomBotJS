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

	// Range test
	function test(number, range) {
		range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		for (let i = 0; i < range.length; ++i) {
			if (number < range[i]) {
				return i;
			}
		}
	}

	// Set up the message as an embed, ready to post
	const regionVoteMessage = {
		color: 0x3366ff,
		title: 'Vote for region!',
		description: 'Please vote on the region for tonights games!',
		fields: [
			{
				name: 'Vote will close in:',
				value: `${client.config.default_timer} minutes`,
			},
		],
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL,
			text: '© DanBennett',
		},
	};

	console.log('region_vote is = ') + region_vote;

	try {
		await games_channel
			.send({ embed: regionVoteMessage })
			.then(async embedMessage => {
				await embedMessage.react(emojiCharacters['EU']);
				await embedMessage.react(emojiCharacters['US']);
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
					embedMessage.delete();
					games_channel.send(
						`${reactions[reactionID]._emoji} won the region vote!`
					);
					host_channel.send(
						`${reactions[reactionID]._emoji} won the region vote!`
					);
				}, client.config.default_timer * 60 * 1000);
			});
	}
	catch (error) {
		console.log(`${error}`);
	}

	// Post the message and set up the reactions
};
