const Discord = require('discord.js');
const config = require('../config.json');
const { client } = require('../index');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    /**@type {Discord.TextChannel} */
    const host_channel = client.channels.cache.get(config.host_channel_id);

    if (args[0] > -1 && args[0] < 100) {
        client.channels.cache.forEach(channel => {
            if (channel.type == 'voice') {
                if (channel.name.startsWith(config.voice_channel_emoji)) {
                    try {
                        channel.setUserLimit(args[0]).catch(console.error);
                    }
                    catch (errorlog) {
                        console.log(`${errorlog}`);
                    }
                }
            }
        });
        if (args[0] == 0) host_channel.send(`:white_check_mark: Voice limit removed`).catch(console.error);
        else host_channel.send(`:white_check_mark: Voice limit set to ${args[0]}`).catch(console.error);
    }
    else {
        host_channel.send(new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Error!')
            .addField('One or more of your arguments are wrong',
                'Number must be a number and between 1 and 99, or 0 to remove the limit.')
            .setTimestamp()
            .setFooter('', client.user.displayAvatarURL())
        ).catch(console.error);
    }
}
