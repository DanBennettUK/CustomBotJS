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

	// Set up the message as an embed, ready to post
	const title = 'Vote for region!';
	const description = 'Please vote on the region for tonights games!';
	const winValue = 'The winning region was:';
	const footerText = '© DanBennett';
	let timer = client.config.default_timer;
	let regionChoices = [];

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
		let maps = args.map(function(word) {
			return word.toLowerCase();
		});
		let i = 0;
		if (maps.some(map => map.includes(`eu`))) {
			regionChoices[i] = `${emojiCharacters['EU']} for Europe`;
			i++;
		}
		if (maps.some(map => map.includes(`na`))) {
			regionChoices[i] = `${emojiCharacters['NA']} for North America`;
			i++;
		}
		if (maps.some(map => map.includes(`sea`))) {
			regionChoices[i] = `${emojiCharacters['SEA']} for Southeast Asia`;
			i++;
		}
		if (maps.some(map => map.includes(`oce`))) {
			regionChoices[i] = `${emojiCharacters['OCE']} for Oceania`;
			i++;
		}
		if (maps.some(map => map.includes(`kr`))) {
			regionChoices[i] = `${emojiCharacters['KR']} for Korea/Japan`;
		}
	} else {
		regionChoices = [
		`${emojiCharacters['EU']} for Europe`, 
		`${emojiCharacters['NA']} for North America`,
		`${emojiCharacters['SEA']} for Southeast Asia`,
		`${emojiCharacters['OCE']} for Oceania`,
		`${emojiCharacters['KR']} for Korea/Japan`
		];
	}
	let choices = regionChoices.join(`\n`);
	
	const regionVoteMessage = {
		color: 0x3366ff,
		title: `${title}`,
		description: `${description}`,
		fields: [
			{
				name: 'Choose a reaction',
				value: choices
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

	try {
		await games_channel
			.send({ embed: regionVoteMessage })
			.then(async embedMessage => {

				//Checks if message is deleted
				let checkIfDeleted = setInterval(function() {
					if (embedMessage.deleted) {
						clearTimeout(timeToVote);
						clearInterval(checkIfDeleted);
					}
				}, 1000);

				if(args.length > 0 && args[0] !== `all`) {
					if (maps.some(map => map.includes(`eu`))) {
						await embedMessage.react(emojiCharacters['EU']);
					}
					if (maps.some(map => map.includes(`na`))) {
						await embedMessage.react(emojiCharacters['NA']);
					}
					if (maps.some(map => map.includes(`sea`))) {
						await embedMessage.react(emojiCharacters['SEA']);
					}
					if (maps.some(map => map.includes(`oce`))) {
						await embedMessage.react(emojiCharacters['OCE']);
					}
					if (maps.some(map => map.includes(`kr`))) {
						await embedMessage.react(emojiCharacters['KR']);
					}
				}
				else {
					await embedMessage.react(emojiCharacters['EU']);
					await embedMessage.react(emojiCharacters['NA']);
					await embedMessage.react(emojiCharacters['SEA']);
					await embedMessage.react(emojiCharacters['OCE']);
					await embedMessage.react(emojiCharacters['KR']);
				}

				if (client.config.custom_role_ping == true) {
					customRole
						.setMentionable(true, 'Role needs to be pinged')
						.catch(console.error);
					games_channel.send(customRole + ' - get voting!').then(
						customRole
							.setMentionable(
								false,
								'Role no longer needs to be pinged'
							)
							.catch(console.error))
				}
				let timeToVote = setTimeout(function() {
					const reactions = embedMessage.reactions.array();
					let reactionID;
					let maxCount = 0;
					for (let i = 0; i < reactions.length; i++) {
						if (reactions[i].count > maxCount) {
							maxCount = reactions[i].count;
							reactionID = i;
						}
					}

					let draws = [];
					for(let i = 0, j = 0; i < reactions.length; i++) {
						if(reactions[i].count == maxCount) {
							draws[j] = i;
							j++;
						}
					}
					if(draws.length > 1) {
						reactionID = draws[Math.floor(Math.random() * Math.floor(draws.length))];
					}

					const regionResult = {
						color: 0x009900,
						title: `${title}`,
						fields: [
							{
								name: `${winValue}`,
								value: `${reactions[reactionID]._emoji}`,
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
					if (client.config.host_channel_messages === true) {
						host_channel.send(
							`${winValue} ${reactions[reactionID]._emoji}`
						);
					}
				}, timer * 60 * 1000);
			});
	}
	catch (error) {
		console.log(`${error}`);
	}

	// Post the message and set up the reactions
};
