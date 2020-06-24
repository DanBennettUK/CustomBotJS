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
    /**@type {Discord.TextChannel} */
    const games_channel = client.channels.cache.get(config.games_channel_id);
    let timerText = '';
    let timer = config.default_timer;

    if (args.length > 0) {
        if (parseInt(args[args.length - 1]) || args[args.length - 1] == 0) {
            timer = parseInt(args[args.length - 1]);
            args.splice(args.length - 1, 1);
        }
    }

    if (isNaN(args))
        host_channel.send(`'${args}' is not a number!`);

    if (timer == 1)
        timerText = 'minute';
    else
        timerText = 'minutes';

    if (timer == 0) {
        games_channel.send(new Discord.MessageEmbed()
            .setColor(0x009900)
            .setTitle('Game started!')
            .setTimestamp()
            .setFooter('', client.user.displayAvatarURL())
        ).catch(console.error);
        if (config.host_channel_messages === true)
            host_channel.send(new Discord.MessageEmbed()
                .setColor(0x009900)
                .setTitle('Game started!')
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).catch(console.error);
    }
    else {
        try {
            await games_channel.send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('The game will start in')
                .setDescription(`${timer} ${timerText}`)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).then(async embedMessage => {
                const timeToVote = setTimeout(function () {
                    embedMessage.delete();
                    games_channel.send(new Discord.MessageEmbed()
                        .setColor(0x009900)
                        .setTitle('Game started!')
                        .setTimestamp()
                        .setFooter('', client.user.displayAvatarURL())
                    ).catch(console.error);
                    if (config.host_channel_messages === true)
                        host_channel.send(new Discord.MessageEmbed()
                            .setColor(0x009900)
                            .setTitle('Game started!')
                            .setTimestamp()
                            .setFooter('', client.user.displayAvatarURL())
                        ).catch(console.error);
                }, timer * 60 * 1000);
                // Checks if message is deleted
                const checkIfDeleted = setInterval(function () {
                    if (embedMessage.deleted) {
                        clearTimeout(timeToVote);
                        clearInterval(checkIfDeleted);
                    }
                }, 1000);
            });
        }
        catch (error) {
            console.log(`${error}`);
        }
    }
};
