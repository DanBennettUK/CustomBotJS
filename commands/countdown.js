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
    const countdownText = 'The countdown will end in';
    const countdownEndText = 'Countdown Ended!';
    let timerText;
    let timer = config.default_timer;

    if (args.length > 0) {
        if (parseInt(args[args.length - 1]) || args[args.length - 1] == 0) {
            timer = parseInt(args[args.length - 1]);
            args.splice(args.length - 1, 1);
        }
        if (isNaN(timer)) {
            const error = {
                color: 0xff0000,
                title: 'Error!',
                description: 'Minutes is missing or not a number!',
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.displayAvatarURL()
                }
            };
            host_channel.send({ embed: error });
            return;
        }
    }

    if (timer == 1) {
        timerText = 'minute';
    }
    else {
        timerText = 'minutes';
    }

    const countdownEmbed = {
        color: 0x3366ff,
        title: `${countdownText}`,
        description: `${timer} ${timerText}`,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.displayAvatarURL(),
        },
    };

    try {
        await games_channel
            .send({ embed: countdownEmbed })
            .then(async embedMessage => {
                const countdownInterval = setTimeout(function () {
                    const countdownEndedEmbed = {
                        color: 0x009900,
                        title: `${countdownEndText}`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.displayAvatarURL(),
                        },
                    };
                    embedMessage.delete();
                    games_channel.send({ embed: countdownEndedEmbed });
                    if (config.host_channel_messages === true) {
                        host_channel.send({ embed: countdownEndedEmbed });
                    }
                }, timer * 60 * 1000);
                // Checks if message is deleted
                const checkIfDeleted = setInterval(function () {
                    if (embedMessage.deleted) {
                        clearTimeout(countdownInterval);
                        clearInterval(checkIfDeleted);
                    }
                }, 1000);
            });
    }
    catch (error) {
        console.log(`${error}`);
    }
};
