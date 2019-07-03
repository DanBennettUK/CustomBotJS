// Requirements
const Discord = require('discord.js');
const fs = require('fs');
const { Client, RichEmbed } = require('discord.js');
const emojiCharacters = require('./emojiCharacters.js');
const config = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Post in console when ready
client.once('ready', () => {
	console.log('Ready!');
});

// On connect do these:
client.on('ready', () => {
	client.user.setActivity(config.activity, {
		type: 'PLAYING',
	});
});

// Debug errors
client.on('error', e => console.error(e));
client.on('warn', e => console.warn(e));
client.on('debug', e => console.info(e));

// Login using code from config file
client.login(config.token);

// Start parsing messages
client.on('message', async message => {
	// Ignore bots own messages.
	if (message.author.bot) return;

	// Ignore messages that do not begin with the prefix.
	if (message.content.indexOf(config.prefix) !== 0) return;

	// Here we separate our "command" name, and our "arguments" for the command.
	// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	const args = message.content
		.slice(config.prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();

	// Help command
	if (command === 'help') {
		if (
			!message.member.roles.some(role => role.id === config.host_role_id)
		) {
			const helpEmbed = new Discord.RichEmbed()
				.setColor('ffffff')
				.setAuthor(client.user.username, client.user.displayAvatarURL)
				.setDescription(
					`**General Commands for users**
                \`${config.prefix}help\` - lists all commands
                \`${config.prefix}ping\` - checks Discord API response`
				)
				.setTimestamp()
				.setFooter(`Version: ${config.version}`);
			message.channel.send(helpEmbed);
		}
		else if (
			message.member.roles.some(role => role.id === config.host_role_id)
		) {
			const hostHelpEmbed = new Discord.RichEmbed()
				.setColor('ffffff')
				.setAuthor(client.user.username, client.user.displayAvatarURL)
				.setDescription(
					`**General Commands for hosts**
                \`${config.prefix}help\` - lists all commands
                \`${config.prefix}ping\` - checks Discord API response`
				)
				.setTimestamp()
				.setFooter(`Version: ${config.version}`);
			message.channel.send(hostHelpEmbed);
		}
	}

	// Ping command
	if (command === 'ping') {
		// Calculates ping between sending a message and editing it, giving a nice round-trip latency.
		// The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
		const ping_message = await message.channel.send('Ping?');
		ping_message.edit(
			`Pong! Latency is ${ping_message.createdTimestamp -
				message.createdTimestamp}ms. API Latency is ${Math.round(
				client.ping
			)}ms`
		);
	}

	// Send message to hosts channel
	if (command === 'hello' && message.channel.id === config.host_channel_id) {
		message.delete();
		const channel = client.channels.get(config.host_channel_id);
		channel.send('Hello! :wave:');
	}

	// Send message to games channel
	if (command === 'hello' && message.channel.id === config.games_channel_id) {
		message.delete();
		const channel = client.channels.get(config.games_channel_id);
		channel.send('Hello you! :wave:');
	}

	if (command === 'countdown') {
		let seconds = args;
		const games_channel = client.channels.get(config.games_channel_id);
		games_channel
			.send('Countdown: ' + seconds + 's')
			.then(message => {
				const countInterval = setInterval(() => {
					if (seconds === '0s') {
						message.edit((seconds = 'Countdown complete.'));
						return clearInterval(countInterval);
					}
					message.edit(
						'Countdown: ' + (seconds = seconds - 10) + 's'
					);
				}, 10000);
			})
			.catch(console.error);
	}

	// Start Squadvote Command
	if (
		command === 'squadvote' ||
		(command === 'sqv' && message.channel.id === config.host_channel_id)
	) {
		const host_channel = client.channels.get(config.host_channel_id);
		const time = config.default_timer;
		const reactionArray = [];
		const reactionCountsArray = [];
		const emojiList = [
			'1⃣',
			'2⃣',
			'3⃣',
			'4⃣',
			'5⃣',
			'6⃣',
			'7⃣',
			'8⃣',
			'9⃣',
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
					reactionArray[0] = await message.react(
						emojiCharacters[1]
					);
					reactionArray[1] = await message.react(
						emojiCharacters[2]
					);
					reactionArray[2] = await message.react(
						emojiCharacters[4]
					);
					reactionArray[3] = await message.react(
						emojiCharacters[8]
					);
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
								message.reactions.get(emojiList[i]).count - 1;
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
}); // Close of message parsing
