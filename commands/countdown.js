const Discord = require('discord.js');
const { client } = require('../index');
const config = require('../config.json');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    /**@type {Discord.TextChannel} */
    const host_channel = client.channels.cache.get(config.host_channel_id);
    /**@type {Discord.TextChannel} */
    const games_channel = client.channels.cache.get(config.games_channel_id);
    let timerText = '';
    let timer = config.default_timer;

    if (args.length > 0) {
        if (parseInt(args[args.length - 1]) || args[args.length - 1] == 0) {
            timer = parseInt(args[args.length - 1]);
            args.splice(args.length - 1, 1);
        }
        if (isNaN(timer)) {
            host_channel.send(new Discord.MessageEmbed()
                .setColor(0xff0000)
                .setTitle('Error!')
                .setDescription('Minutes is missing or not a number!')
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())).catch(console.error);
            return;
        }
    }

    if (timer == 1)
        timerText = 'minute';
    else
        timerText = 'minutes';

    try {
        await games_channel
            .send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('The countdown will end in')
                .setDescription(`${timer} ${timerText}`)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).then(async embedMessage => {
                const countdownInterval = setTimeout(function () {
                    embedMessage.delete();
                    games_channel.send(new Discord.MessageEmbed()
                        .setColor(0x009900)
                        .setTitle('Countdown Ended!')
                        .setTimestamp()
                        .setFooter('', client.user.displayAvatarURL())).catch(console.error);
                    if (config.host_channel_messages === true)
                        host_channel.send(new Discord.MessageEmbed()
                            .setColor(0x009900)
                            .setTitle('Countdown Ended!')
                            .setTimestamp()
                            .setFooter('', client.user.displayAvatarURL())).catch(console.error);
                }, timer * 60 * 1000);
                // Checks if message is deleted
                const checkIfDeleted = setInterval(function () {
                    if (embedMessage.deleted) {
                        clearTimeout(countdownInterval);
                        clearInterval(checkIfDeleted);
                    }
                }, 1000);
            }).catch(console.error);
    }
    catch (error) {
        console.error(`${error}`);
    }
};
