const Discord = require('discord.js');
const { client } = require('../index');
const config = require('../config.json');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {
    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    const customRole = message.guild.roles.cache.get(config.custom_role_id);
    /**@type {Discord.TextChannel} */
    const host_channel = client.channels.cache.get(config.host_channel_id);
    /**@type {Discord.TextChannel} */
    const games_channel = client.channels.cache.get(config.games_channel_id);

    await customRole.setMentionable(true, 'Role needs to be pinged').catch(console.error);
    await games_channel.send(`${customRole} ${args.join(' ')}`).catch(console.error);
    await customRole.setMentionable(false, 'Role no longer needs to be pinged').catch(console.error);

    host_channel.send({
        embed: {
            color: 0x3366ff,
            title: 'Message sent',
            description: `Message:\n${customRole} ${args.join(' ')}`,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.displayAvatarURL(),
            }
        }
    }).catch(console.error);
}