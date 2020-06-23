const Discord = require('discord.js');
const { client } = require('../index');
const config = require('../config.json');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    message.channel.send(new Discord.MessageEmbed()
        .setColor(0x3366ff)
        .setTitle('Ping')
        .setTimestamp()
        .setFooter('', client.user.displayAvatarURL())
    ).then(ping_message => {
        ping_message.edit(new Discord.MessageEmbed()
            .setColor(ping_message.embeds[0].color)
            .setTitle(ping_message.embeds[0].title)
            .setDescription('Pong!')
            .addField('Latency', `${ping_message.createdTimestamp - message.createdTimestamp}ms`), true)
            .addField('API latency', `${Math.round(client.ws.ping)}ms`, true)
    }).catch(console.error);
};