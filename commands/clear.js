exports.run = async (client, message, args) => {
    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    const host_channel = client.channels.get(client.config.host_channel_id);
    const games_channel = client.channels.get(client.config.games_channel_id);
    const footerText = '© DanBennett';
    let clearMessage;

    if (args[0] === 'all') {
        await games_channel
            .fetchMessages({ limit: 100 })
            .then(async collected => {
                const botMsg = collected.filter(
                    m => m.author.id == client.config.bot_id
                );
                await games_channel.bulkDelete(botMsg, true).then(
                    (clearMessage = {
                        color: 0x009900,
                        title: 'Clear Messages',
                        description: `Cleared ${botMsg.size} messages!`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: `${footerText}`,
                        },
                    }),
                    host_channel.send({ embed: clearMessage })
                );
            })
            .catch(console.error);
    }
    else if (!isNaN(args[0])) {
        await games_channel
            .fetchMessages({ limit: args[0] })
            .then(async collected => {
                const botMsg = collected.filter(
                    m => m.author.id == client.config.bot_id
                );
                await games_channel.bulkDelete(botMsg, true).then(
                    (clearMessage = {
                        color: 0x009900,
                        title: 'Clear Messages',
                        description: `Cleared ${botMsg.size} messages!`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: `${footerText}`,
                        },
                    }),
                    host_channel.send({ embed: clearMessage })
                );
            })
            .catch(console.error);
    }
    else {
        clearMessage = {
            color: 0x009900,
            title: 'Clear Messages',
            description:
                'Choose the number of messages you want to clear, or `all` to clear all messages',
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: `${footerText}`,
            },
        };
        host_channel.send({ embed: clearMessage });
    }
};
