module.exports = (client, message) => {
	// Ignore all bots
	if (message.author.bot) return;

	// Ignore messages not starting with the prefix (in config.json)
	if (message.content.indexOf(client.config.prefix) !== 0) return;

	// Our standard argument/command name definition.
	const args = message.content
		.slice(client.config.prefix.length)
		.trim()
		.split(/ +/g);
	let command = args.shift().toLowerCase();

	// Command aliases
	if (command === 'sqv') command = 'squadvote';
	if (command === 'rv') command = 'regionvote';
	if (command === 'pv') command = 'perspectivevote';
	if (command === 'mv') command = 'mapvote';
	if (command === 'pwd') command = 'password';

	// Grab the command data from the client.commands Enmap
	const cmd = client.commands.get(command);

	// If that command doesn't exist, silently exit and do nothing
	if (!cmd) return;

	// Run the command
	cmd.run(client, message, args);
};
