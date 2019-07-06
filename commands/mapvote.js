exports.run = async (client, message, args) => {
	if (message.channel.id !== client.config.host_channel_id) {
		// If the command isn't ran in the host channel, do nothing.
		return;
	}

	const emojiCharacters = require('../emojiCharacters.js');
	const host_channel = client.channels.get(client.config.host_channel_id);
	const games_channel = client.channels.get(client.config.games_channel_id);
	var timer = client.config.default_timer;

	// Set up the message as an embed, ready to post
	const title = 'Vote for map!';
	const description = 'Please vote on the map for the next game!';
	const winValue = 'The winning map was:';
	const footerText = '© DanBennett';
	var mapChoices = [];

	if(args.length > 0) {
		if(parseInt(args[args.length-1]) || args[args.length-1] == 0) {
			if(args[args.length-1] > 0) {
				timer = parseInt(args[args.length-1]);
			}
			args.splice((args.length - 1), 1);
		}
	}

	if(args.length > 0 && args[0] !== `all`) {
		if(args.length > 0)
		var maps = args.map(function(word) {
			return word.toLowerCase();
		});
		var i = 0;
		if (maps.some(map => map.includes(`erangel`))) {
			mapChoices[i] = `${emojiCharacters['Erangel']} for Erangel`;
			i++;
		}
		if (maps.some(map => map.includes(`miramar`))) {
			mapChoices[i] = `${emojiCharacters['Miramar']} for Miramar`;
			i++;
		}
		if (maps.some(map => map.includes(`sanhok`))) {
			mapChoices[i] = `${emojiCharacters['Sanhok']} for Sanhok`;
			i++;
		}
		if (maps.some(map => map.includes(`vikendi`))) {
			mapChoices[i] = `${emojiCharacters['Vikendi']} for Vikendi`;
		}
	} else {
		mapChoices = [
		`${emojiCharacters['Erangel']} for Erangel`, 
		`${emojiCharacters['Miramar']} for Miramar`,
		`${emojiCharacters['Sanhok']} for Sanhok`,
		`${emojiCharacters['Vikendi']} for Vikendi`
		];
	}
	var choices = mapChoices.join(`\n`);

	const mapVoteMessage = {
		color: 0x3366ff,
		title: `${title}`,
		description: `${description}`,
		fields: [
			{
				name: 'Choose a reaction',
				value: choices,
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

				//Checks if message is deleted
				var checkIfDeleted = setInterval(function() {
					if (embedMessage.deleted) {
						clearTimeout(timeToVote);
						clearInterval(checkIfDeleted);
					}
				}, 1000);

				if(args.length > 0 && args[0] !== `all`) {
					if (maps.some(map => map.includes(`erangel`))) {
						await embedMessage.react(emojiCharacters['Erangel']);
					} if (maps.some(map => map.includes(`miramar`))) {
						await embedMessage.react(emojiCharacters['Miramar']);
					} if (maps.some(map => map.includes(`sanhok`))) {
						await embedMessage.react(emojiCharacters['Sanhok']);
					} if (maps.some(map => map.includes(`vikendi`))) {
						await embedMessage.react(emojiCharacters['Vikendi']);
					}
				} else {
					await embedMessage.react(emojiCharacters['Erangel']);
					await embedMessage.react(emojiCharacters['Miramar']);
					await embedMessage.react(emojiCharacters['Sanhok']);
					await embedMessage.react(emojiCharacters['Vikendi']);
				}
				var timeToVote = setTimeout(function() {

					const reactions = embedMessage.reactions.array();
					let reactionID;
					let maxCount = 0;
					for (let i = 0; i < reactions.length; i++) {
						if (reactions[i].count > maxCount) {
							maxCount = reactions[i].count;
							reactionID = i;
						}
					}
					var draws = [];
					for(var i = 0, j = 0; i < reactions.length; i++) {
						if(reactions[i].count == maxCount) {
							draws[j] = i;
							j++;
						}
					}
					if(draws.length > 1) {
						reactionID = draws[Math.floor(Math.random() * Math.floor(draws.length))];
					}

					const mapResult = {
						color: 0x009900,
						title: `${title}`,
						fields: [
							{
								name: 'Choices:',
								value: choices,
							},
							{
								name: `${winValue}`,
								value: `${mapChoices[reactionID]}`,
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
				}, timer * 60 * 1000);
			});
	}
	catch (error) {
		console.log(`${error}`);
	}

	// Post the message and set up the reactions
};
