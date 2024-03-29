exports.run = async (client, message, args) => {

    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    let pingEmbed = {
        color: 0x3366ff,
        title: `Ping`,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
        }
    };

    const ping_message = await message.channel.send({embed: pingEmbed});
    pingEmbed.description = `Pong!`;
    pingEmbed.fields = [
        {
            name: `Latency`,
            value: `${ping_message.createdTimestamp -
            message.createdTimestamp}ms`,
            inline: true
        },
        {
            name: `API latency`,
            value: `${Math.round(client.ping)}ms`,
            inline: true
        }
    ];
    ping_message.edit({embed: pingEmbed}).catch(console.error);
};