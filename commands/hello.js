const Discord = require('discord.js');
const { client } = require('../index');
const config = require('../config.json');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {
    const customRole = message.guild.roles.cache.get(config.custom_role_id);

    if (message.channel.id === config.host_channel_id) {
        message.delete();
        const channel = client.channels.cache.get(config.host_channel_id);
        channel.send('Hello! :wave:');
    }

    // Send message to games channel
    if (message.channel.id === config.games_channel_id) {
        message.delete();
        const channel = client.channels.cache.get(config.games_channel_id);
        await customRole
            .setMentionable(true, 'Role needs to be pinged')
            .catch(console.error);
        await channel.send('Hello ' + customRole + ':wave:');
        await customRole
            .setMentionable(false, 'Role no longer needs to be pinged')
            .catch(console.error);
    }
};
