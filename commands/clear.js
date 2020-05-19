const Discord = require('discord.js');
const { client } = require('../index');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    /**@type {Discord.TextChannel} */
    const host_channel = client.channels.cache.get(client.config.host_channel_id);
    /**@type {Discord.TextChannel} */
    const games_channel = client.channels.cache.get(client.config.games_channel_id);
    let clearMessage;

    if (args[0] && args[0].toLowerCase() === 'all') {
        await games_channel.messages
            .fetch({ limit: 100 })
            .then(async collected => {
                const botMsg = await collected.filter(
                    m => m.author.id == client.user.id
                );
                await games_channel.bulkDelete(botMsg, true).then(
                    (clearMessage = {
                        color: 0x009900,
                        title: 'Clear Messages',
                        description: `Cleared ${botMsg.size} messages!`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.displayAvatarURL(),
                        },
                    }),
                    host_channel.send({ embed: clearMessage })
                );
            })
            .catch(console.error);
    }
    else if (!isNaN(args[0])) {
        await games_channel.messages
            .fetch({ limit: args[0] })
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
                            icon_url: client.user.displayAvatarURL(),
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
                icon_url: client.user.displayAvatarURL()
            },
        };
        host_channel.send({ embed: clearMessage });
    }
};
