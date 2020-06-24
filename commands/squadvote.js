const Discord = require('discord.js');
const config = require('../config.json');
const { client } = require('../index');
const emojiCharacters = require('../emojiCharacters.js');
let timer = config.default_timer;
let timerText = '';
let customRole = '';
/**@type {Discord.TextChannel} */
const host_channel = client.channels.cache.get(config.host_channel_id);
/**@type {Discord.TextChannel} */
const games_channel = client.channels.cache.get(config.games_channel_id);

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    // Get customRole for pinging later
    customRole = message.guild.roles.cache.get(config.custom_role_id);

    if (/-[0-9]+/.test(args[args.length - 1])) {
        timer = args[args.length - 1].replace('-', '');
        args.splice(args.length - 1, 1);
    }

    if (timer == 1)
        timerText = 'minute';
    else
        timerText = 'minutes';

    if (args.length == 0)
        // If the array is empty, only vote for 1, 2, 4 or 8.
        squadTryMessage(['1', '2', '4', '8']);
    else if (args[0] == 'all')
        // If the array is 'all' - post up to 10
        squadTryMessage(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    else if (isNaN(args[0])) {
        // If it's not a number...
        host_channel.send('Error: Please only use numbers!');
        return;
    }
    else {
        // Picked squad sizes by host
        // Check the array fits in the range we want
        if (containsAny(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], args) === false)
            host_channel.send('A number is out of range');
        else
            squadTryMessage(args);
    }
}

/**@function containsAny This function compares two arrays
 *@param {String[]} source The array we're comparing
 *@param {String[]} target The array we're comparing it to
 */
function containsAny(source, target) {
    const result = source.filter(function (item) {
        return target.indexOf(item) > -1;
    });
    return result.length > 0;
}

/**@function squadTryMessage
 * This function sends the squad vote messages
 * @param {String[]} squad_sizes The squad sized to choose from
 */
async function squadTryMessage(squad_sizes) {
    if (timer == 0) {
        let squad_sizes_emojis = [];
        squad_sizes.forEach(size => {
            squad_sizes_emojis.push(emojiCharacters[size]);
        });
        let winReact = squad_sizes_emojis[Math.floor(Math.random() * Math.floor(squad_sizes.length))];
        games_channel.send(new Discord.MessageEmbed()
            .setColor(0x3366ff)
            .setTitle('Random squad size selection')
            .setDescription('The squad size for the next game will be selected randomly from the choices provided')
            .addField('Choices', squad_sizes_emojis.join('\n'), true)
            .addField('Selection', winReact, true)
            .setTimestamp()
            .setFooter('', client.user.displayAvatarURL())
        ).catch(console.error);
        if (config.host_channel_messages === true)
            host_channel.send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('Random squad size selection')
                .setDescription('The squad size for the next game will be selected randomly from the choices provided')
                .addField('Choices', squad_sizes_emojis.join('\n'), true)
                .addField('Selection', winReact, true)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).catch(console.error);
        let channelSize = -1;

        squad_sizes.forEach(size => {
            if (winReact == emojiCharacters[size]) {
                channelSize = parseInt(size);
                return;
            }
        });

        client.channels.cache.forEach(channel => {
            if (channel.type == 'voice') {
                if (channel.name.startsWith(config.voice_channel_emoji)) {
                    try {
                        channel.setUserLimit(channelSize).catch(console.error);
                    }
                    catch (errorlog) {
                        console.log(`${errorlog}`);
                    }
                }
            }
        });
        host_channel.send(`:white_check_mark: Voice limit set to ${channelSize}`);
    }
    else {
        try {
            await games_channel.send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('Vote for squad size!')
                .setDescription('Please vote on the squad size for the next game')
                .addField('Choose a reaction', 'Click the reaction for the amount of players in each squad you want.')
                .addField('Vote will close in:', `${timer} ${timerText}`)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).then(async embedMessage => {
                /**@param {Discord.MessageReaction} reaction @param {Discord.User} user*/
                const filter = (reaction, user) => reaction.users.cache.has(client.user.id);
                const collector = embedMessage.createReactionCollector(filter);
                for (let i = 0; i < squad_sizes.length; i++)
                    await embedMessage.react(emojiCharacters[squad_sizes[i]]);

                if (config.custom_role_ping == true) {
                    await customRole.setMentionable(true, 'Role needs to be pinged').catch(console.error);
                    await games_channel.send(`${customRole} - get voting!`).then(msg =>
                        setTimeout(function () {
                            msg.delete();
                        }, timer * 60 * 1000)
                    ).catch(console.error);
                    await customRole.setMentionable(false, 'Role no longer needs to be pinged').catch(console.error);
                }
                collector.on('end', reactions => {
                    let reactionID = -1;
                    let maxCount = 0;
                    reactions.forEach(r => {
                        if (r.count > maxCount) {
                            maxCount = r.count;
                            reactionID = r.emoji.name;
                        }
                    });
                    let draws = [];
                    reactions.forEach(r => {
                        if (r.count == maxCount)
                            draws.push(r.emoji.name);
                    });
                    if (draws.length > 1)
                        reactionID = draws[Math.floor(Math.random() * Math.floor(draws.length))];
                    let winReact = reactionID;

                    let fields = [];

                    if (draws.length > 1)
                        fields = [
                            {
                                name: 'Draws',
                                value: `${draws.join(' ')}`,
                                inline: true
                            },
                            {
                                name: 'The winning squad size is:',
                                value: `${winReact}`,
                                inline: true
                            }
                        ];
                    else
                        fields = [
                            {
                                name: 'The winning squad size is:',
                                value: `${winReact}`,
                            }
                        ];

                    embedMessage.delete();
                    games_channel.send(new Discord.MessageEmbed()
                        .setColor(0x009900)
                        .setTitle('Vote for squad size!')
                        .addFields(fields)
                        .setTimestamp()
                        .setFooter('', client.user.displayAvatarURL())
                    ).catch(console.error);
                    if (config.host_channel_messages === true)
                        host_channel.send(new Discord.MessageEmbed()
                            .setColor(0x009900)
                            .setTitle('Vote for squad size!')
                            .addFields(fields)
                            .setTimestamp()
                            .setFooter('', client.user.displayAvatarURL())
                        ).catch(console.error);

                    let channelSize = -1;

                    squad_sizes.forEach(size => {
                        if (winReact == emojiCharacters[size]) {
                            channelSize = parseInt(size);
                            return;
                        }
                    });

                    client.channels.cache.forEach(channel => {
                        if (channel.type == 'voice') {
                            if (channel.name.startsWith(config.voice_channel_emoji)) {
                                try {
                                    channel.setUserLimit(channelSize).catch(console.error);
                                }
                                catch (errorlog) {
                                    console.log(`${errorlog}`);
                                }
                            }
                        }
                    });
                    host_channel.send(`:white_check_mark: Voice limit set to ${channelSize}`);
                });
                const timeToVote = setTimeout(async function () {
                    collector.stop();
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
}