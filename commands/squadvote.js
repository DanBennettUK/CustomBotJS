exports.run = async (client, message, args) => {
	if (message.channel.id === client.config.host_channel_id) {
		const host_channel = client.channels.get(client.config.host_channel_id);
		const time = client.config.default_timer;
		const reactionArray = [];
		const reactionCountsArray = [];
		const emojiCharacters = require('../emojiCharacters.js');
		const emojiList = [
			'0️⃣',
			'1️⃣',
			'2️⃣',
			'3️⃣',
			'4️⃣',
			'5️⃣',
			'6️⃣',
			'7️⃣',
			'8️⃣',
			'9️⃣',
			'🔟',
		];
		let squad_vote_message;

		if (!args.length) {
			message.channel.send(
				`You didn't provide squad sizes, ${
					message.author
				}! Using the defaults...`
			);
			(squad_vote_message = 'Vote for the squad size for the next game!'),
			host_channel
				.send(squad_vote_message)
				.then(async function(message) {
					reactionArray.push = await message.react(
						emojiCharacters[1]
					);
					console.log(emojiCharacters[1]);
					reactionArray.push = await message.react(
						emojiCharacters[2]
					);
					reactionArray.push = await message.react(
						emojiCharacters[4]
					);
					reactionArray.push = await message.react(
						emojiCharacters[8]
					);
					console.log(reactionCountsArray);
				});
		}
		else {
			(squad_vote_message = 'Vote for the squad size for the next game!'),
			host_channel
				.send(squad_vote_message)
				.then(async function(message) {
					reactionArray[0] = await message.react(
						emojiCharacters[args[0]]
					);
					reactionArray[1] = await message.react(
						emojiCharacters[args[1]]
					);
					reactionArray[2] = await message.react(
						emojiCharacters[args[2]]
					);
					reactionArray[3] = await message.react(
						emojiCharacters[args[3]]
					);
					reactionArray[4] = await message.react(
						emojiCharacters[args[4]]
					);
					reactionArray[5] = await message.react(
						emojiCharacters[args[5]]
					);
					reactionArray[6] = await message.react(
						emojiCharacters[args[6]]
					);
					reactionArray[7] = await message.react(
						emojiCharacters[args[7]]
					);
					reactionArray[8] = await message.react(
						emojiCharacters[args[8]]
					);
					reactionArray[9] = await message.react(
						emojiCharacters[args[9]]
					);
				})
				.catch(console.error);
		}
		if (time) {
			host_channel.send(
				`The vote has started and will last ${time} minute(s)`
			);
		}
		if (time) {
			setTimeout(() => {
				// Re-fetch the message and get reaction counts
				message.channel
					.fetchMessage(message.id)
					.then(async function(message) {
						for (let i = 0; i < reactionArray.length; i++) {
							reactionCountsArray[i] =
								message.reactions.get(emojiCharacters[i])
									.count - 1;
						}

						// Find winner(s)
						let max = -Infinity,
							indexMax = [];
						for (let i = 0; i < reactionCountsArray.length; ++i) {
							if (reactionCountsArray[i] > max) {
								(max = reactionCountsArray[i]),
								(indexMax = [i]);
							}
							else if (reactionCountsArray[i] === max) {
								indexMax.push(i);
							}
						}

						// Display winner(s)
						console.log(reactionCountsArray); // Debugging votes
						let winnersText = 'Winners?';
						if (reactionCountsArray[indexMax[0]] == 0) {
							winnersText = 'No one voted!';
						}
						else {
							for (let i = 0; i < indexMax.length; i++) {
								winnersText +=
									emojiList[indexMax[i]] +
									' (' +
									reactionCountsArray[indexMax[i]] +
									' vote(s))\n';
							}
						}
						host_channel.send(winnersText);
					});
			}, time * 60 * 100);
		}
	}
};
