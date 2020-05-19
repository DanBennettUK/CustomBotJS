const Discord = require('discord.js');
const config = require('../config.json');
const { client } = require('../index');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    // Get customRole for pinging later
    const customRole = message.guild.roles.cache.get(config.custom_role_id);

    const emojiCharacters = require('../emojiCharacters.js');
    /**@type {Discord.TextChannel} */
    const host_channel = client.channels.cache.get(config.host_channel_id);
    /**@type {Discord.TextChannel} */
    const games_channel = client.channels.cache.get(config.games_channel_id);
    let timer = config.default_timer;
    let error_message;

    // Set up the message as an embed, ready to post
    const title = 'Vote for squad size!';
    const description = 'Please vote on the squad size for the next game';
    const winText = 'The winning squad size is:';
    let timerText;

    if (/-[0-9]+/.test(args[args.length - 1])) {
        timer = args[args.length - 1].replace('-', '');
        args.splice(args.length - 1, 1);
    }
    const message_squad_sizes = args;

    // Function to compare two arrays
    /**@param {String[]} source @param {String[]} target*/
    function containsAny(source, target) {
        const result = source.filter(function (item) {
            return target.indexOf(item) > -1;
        });
        return result.length > 0;
    }

    const squads_range = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    if (timer == 1) {
        timerText = 'minute';
    }
    else {
        timerText = 'minutes';
    }

    const squadVoteMessage = {
        color: 0x3366ff,
        title: `${title}`,
        description: `${description}`,
        fields: [
            {
                name: 'Choose a reaction',
                value:
                    'Click the reaction for the amount of players in each squad you want.',
            },
            {
                name: 'Vote will close in:',
                value: `${timer} ${timerText}`,
            }
        ],
        timestamp: new Date(),
        footer: {
            icon_url: client.user.displayAvatarURL(),
        }
    };

    // Function to send the squad vote messages
    async function squadTryMessage(squad_sizes) {
        if (timer == 0) {
            let squad_sizes_emojis = [];
            squad_sizes.forEach(size => {
                squad_sizes_emojis.push(emojiCharacters[size]);
            });
            let winReact = squad_sizes_emojis[Math.floor(Math.random() * Math.floor(squad_sizes.length))];
            const randomSquadEmbed = {
                color: 0x3366ff,
                title: 'Random squad size selection',
                description: 'The squad size for the next game will be selected randomly from the choices provided',
                fields: [
                    {
                        name: 'Choices',
                        value: squad_sizes_emojis.join('\n'),
                        inline: true
                    },
                    {
                        name: 'Selection',
                        value: winReact,
                        inline: true
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.displayAvatarURL(),
                }
            };
            games_channel.send({ embed: randomSquadEmbed }).catch(console.error);
            if (config.host_channel_messages === true) {
                host_channel.send({ embed: randomSquadEmbed }).catch(console.error);
            }
            let channelSize;

            squad_sizes.forEach(size => {
                if (winReact == emojiCharacters[size]) {
                    channelSize = parseInt(size);
                    return;
                }
            });

            client.channels.cache.forEach(channel => {
                if (channel.type == 'voice') {
                    if (
                        channel.name.startsWith(config.voice_channel_emoji)
                    ) {
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
                await games_channel
                    .send({ embed: squadVoteMessage })
                    .then(async embedMessage => {
                        /**@param {Discord.MessageReaction} reaction @param {Discord.User} user*/
                        const filter = (reaction, user) => reaction.users.cache.has(client.user.id);
                        const collector = embedMessage.createReactionCollector(filter);
                        for (let i = 0; i < squad_sizes.length; i++) {
                            await embedMessage.react(
                                emojiCharacters[squad_sizes[i]]
                            );
                        }

                        if (config.custom_role_ping == true) {
                            await customRole
                                .setMentionable(true, 'Role needs to be pinged')
                                .catch(console.error);
                            await games_channel
                                .send(customRole + ' - get voting!')
                                .then(msg =>
                                    setTimeout(function () {
                                        msg.delete();
                                    }, timer * 60 * 1000)
                                )
                                .catch(console.error);
                            await customRole
                                .setMentionable(
                                    false,
                                    'Role no longer needs to be pinged'
                                )
                                .catch(console.error);
                        }
                        collector.on('end', reactions => {
                            let reactionID;
                            let maxCount = 0;
                            reactions.forEach(r => {
                                if (r.count > maxCount) {
                                    maxCount = r.count;
                                    reactionID = r.emoji.name;
                                }
                            });
                            let draws = [];
                            reactions.forEach(r => {
                                if (r.count == maxCount) {
                                    draws.push(r.emoji.name);
                                }
                            });
                            if (draws.length > 1) {
                                reactionID =
                                    draws[
                                    Math.floor(
                                        Math.random() * Math.floor(draws.length)
                                    )
                                    ];
                            }
                            let winReact = reactionID;

                            let squadResult;

                            if (draws.length > 1) {
                                squadResult = {
                                    color: 0x009900,
                                    title: `${title}`,
                                    fields: [
                                        {
                                            name: 'Draws',
                                            value: `${draws.join(' ')}`,
                                            inline: true
                                        },
                                        {
                                            name: `${winText}`,
                                            value: `${winReact}`,
                                            inline: true
                                        }
                                    ],
                                    timestamp: new Date(),
                                    footer: {
                                        icon_url: client.user.displayAvatarURL(),
                                    }
                                };
                            } else {
                                squadResult = {
                                    color: 0x009900,
                                    title: `${title}`,
                                    fields: [
                                        {
                                            name: `${winText}`,
                                            value: `${winReact}`,
                                        }
                                    ],
                                    timestamp: new Date(),
                                    footer: {
                                        icon_url: client.user.displayAvatarURL(),
                                    }
                                };
                            }

                            embedMessage.delete();
                            games_channel.send({ embed: squadResult });
                            if (config.host_channel_messages === true) {
                                host_channel.send({ embed: squadResult });
                            }

                            let channelSize;

                            squad_sizes.forEach(size => {
                                if (winReact == emojiCharacters[size]) {
                                    channelSize = parseInt(size);
                                    return;
                                }
                            });

                            client.channels.cache.forEach(channel => {
                                if (channel.type == 'voice') {
                                    if (
                                        channel.name.startsWith(config.voice_channel_emoji)
                                    ) {
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

    if (message_squad_sizes.length == 0) {
        // If the array is empty, only vote for 1, 2, 4 or 8.
        const squad_sizes = ['1', '2', '4', '8'];
        squadTryMessage(squad_sizes);
    }
    else if (message_squad_sizes[0] == 'all') {
        // If the array is 'all' - post up to 10
        const squad_sizes = squads_range;
        squadTryMessage(squad_sizes);
    }
    else if (isNaN(message_squad_sizes[0])) {
        // If it's not a number...
        error_message = 'Error: Please only use numbers!';
        host_channel.send(error_message);
        return;
    }
    else {
        // Picked squad sizes by host
        // Check the array fits in the range we want
        const squads_correct_range = containsAny(
            squads_range,
            message_squad_sizes
        );
        if (squads_correct_range === false) {
            host_channel.send('A number is out of range');
        }
        else {
            const squad_sizes = message_squad_sizes;
            squadTryMessage(squad_sizes);
        }
    }
};
