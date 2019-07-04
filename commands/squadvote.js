exports.run = async (client, message, args) => {
	if (message.channel.id !== client.config.host_channel_id) {
		// If the command isn't ran in the host channel, do nothing.
		return;
	}
	console.log(args);
	const message_squad_sizes = args;
	const emojiCharacters = require('../emojiCharacters.js');
	const host_channel = client.channels.get(client.config.host_channel_id);
	const games_channel = client.channels.get(client.config.games_channel_id);
	let default_squad_sizes;
	let squad_sizes_selected;
	let error_message;

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
	const squadVoteMessage = {
		color: 0x3366ff,
		title: 'Vote for squad size!',
		description: 'Please vote on the squad size for the next game',
		fields: [
			{
				name: 'Vote will close in:',
				value: `${client.config.default_timer} minutes`,
			},
			{
				// For Debugging. Remove later.
				name: `${squad_sizes_selected}`,
				value: `${squad_sizes_selected}`,
			},
		],
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL,
			text: '© DanBennett',
		},
	};

	console.log('message_squad_sizes is = ') + message_squad_sizes;

	if (message_squad_sizes.length == 0) {
		// If the array is empty
		default_squad_sizes = [1, 2, 4, 8];
		squad_sizes_selected = default_squad_sizes;
		console.log('squad_sizes_selected 0 = ' + squad_sizes_selected);
		try {
			await games_channel
				.send({ embed: squadVoteMessage })
				.then(async embedMessage => {
					await embedMessage.react(emojiCharacters[1]);
					await embedMessage.react(emojiCharacters[2]);
					await embedMessage.react(emojiCharacters[4]);
					await embedMessage.react(emojiCharacters[8]);
				});
		}
		catch (error) {
			console.log(`${error}`);
		}
	}
	else if (message_squad_sizes[0] == 'all') {
		// If the array is 'all'
		squad_sizes_selected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		console.log('squad_sizes_selected 1 = ' + squad_sizes_selected);
		try {
			await games_channel
				.send({ embed: squadVoteMessage })
				.then(async embedMessage => {
					await embedMessage.react(emojiCharacters[1]);
					await embedMessage.react(emojiCharacters[2]);
					await embedMessage.react(emojiCharacters[3]);
					await embedMessage.react(emojiCharacters[4]);
					await embedMessage.react(emojiCharacters[5]);
					await embedMessage.react(emojiCharacters[6]);
					await embedMessage.react(emojiCharacters[7]);
					await embedMessage.react(emojiCharacters[8]);
					await embedMessage.react(emojiCharacters[9]);
					await embedMessage.react(emojiCharacters[10]);
				});
		}
		catch (error) {
			console.log(`${error}`);
		}
	}
	else if (isNaN(message_squad_sizes[0])) {
		// If it's not a number...
		error_message = 'Error: Please only use numbers!';
		host_channel.send(error_message);
		console.log('squad_sizes_selected 2 = ' + squad_sizes_selected);
		return;
	}
	else {
		// Check the array fits in the range we want
		const squads_correct_range = test(message_squad_sizes);
		console.log('Range is = ' + squads_correct_range);
	}

	// Post the message and set up the reactions
};
