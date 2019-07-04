exports.run = async (client, message, args) => {
	if (message.channel.id === client.config.host_channel_id) {
		message.delete();
		const channel = client.channels.get(client.config.host_channel_id);
		channel.send('Hello! :wave:');
	}

	// Send message to games channel
	if (message.channel.id === client.config.games_channel_id) {
		message.delete();
		const channel = client.channels.get(client.config.games_channel_id);
		channel.send('Hello you! :wave:');
	}
};
