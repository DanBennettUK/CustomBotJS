exports.run = async (client, message) => {
    const customRole = message.guild.roles.get(client.config.custom_role_id);

    if (message.channel.id === client.config.host_channel_id) {
        message.delete();
        const channel = client.channels.get(client.config.host_channel_id);
        channel.send('Hello! :wave:');
    }

    // Send message to games channel
    if (message.channel.id === client.config.games_channel_id) {
        message.delete();
        const channel = client.channels.get(client.config.games_channel_id);
        await customRole
            .setMentionable(true, 'Role needs to be pinged')
            .catch(console.error);
        await channel.send('Hello ' + customRole + ':wave:');
        await customRole
            .setMentionable(false, 'Role no longer needs to be pinged')
            .catch(console.error);
    }
};
