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

    // Set up the message as an embed, ready to post
    const title = 'Vote for region!';
    const description = 'Please vote on the region for tonight\'s games!';
    const winValue = 'The winning region is:';
    let timer = config.default_timer;
    let regionChoices = [];
    let timerText;

    args.forEach(function (arg, i) {
        args[i] = arg.toLowerCase();
    });

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

    if (args.length > 0 && args[0] !== 'all') {
        if (args.some(region => region.includes('eu'))) {
            regionChoices.push(`${emojiCharacters['EU']} for Europe`);
        }
        if (args.some(region => region.includes('na'))) {
            regionChoices.push(`${emojiCharacters['NA']} for North America`);
        }
        if (args.some(region => region.includes('sa'))) {
            regionChoices.push(`${emojiCharacters['SA']} for South America`);
        }
        if (args.some(region => region.includes('asia'))) {
            regionChoices.push(`${emojiCharacters['ASIA']} for Asia`);
        }
        if (args.some(region => region.includes('sea'))) {
            regionChoices.push(`${emojiCharacters['SEA']} for Southeast Asia`);
        }
        if (args.some(region => region.includes('oce'))) {
            regionChoices.push(`${emojiCharacters['OCE']} for Oceania`);
        }
        if (args.some(region => region.includes('kr'))) {
            regionChoices.push(`${emojiCharacters['KR']} for Korea/Japan`);
        }
    }
    else {
        regionChoices = [
            `${emojiCharacters['EU']} for Europe`,
            `${emojiCharacters['NA']} for North America`,
            `${emojiCharacters['SA']} for South America`,
            `${emojiCharacters['ASIA']} for Asia`,
            `${emojiCharacters['SEA']} for Southeast Asia`,
            `${emojiCharacters['OCE']} for Oceania`,
            `${emojiCharacters['KR']} for Korea/Japan`,
        ];
    }
    const choices = regionChoices.join('\n');

    const regionVoteMessage = {
        color: 0x3366ff,
        title: `${title}`,
        description: `${description}`,
        fields: [
            {
                name: 'Choose a reaction',
                value: choices,
            },
            {
                name: 'Vote will close in:',
                value: `${timer} ${timerText}`,
            },
        ],
        timestamp: new Date(),
        footer: {
            icon_url: client.user.displayAvatarURL(),
        },
    };

    if (timer == 0) {
        const randomRegionEmbed = {
            color: 0x3366ff,
            title: `Random region selection`,
            description: `The region for the next game will be chosen randomly from the choices provided`,
            fields: [
                {
                    name: 'Choices',
                    value: choices,
                    inline: true
                },
                {
                    name: 'Selection',
                    value: regionChoices[Math.floor(Math.random() * Math.floor(regionChoices.length))],
                    inline: true
                }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.displayAvatarURL(),
            }
        };
        games_channel.send({ embed: randomRegionEmbed }).catch(console.error);
        if (config.host_channel_messages === true) {
            host_channel.send({ embed: randomRegionEmbed }).catch(console.error);
        }
    }
    else {
        try {
            await games_channel
                .send({ embed: regionVoteMessage })
                .then(async embedMessage => {
                    /**@param {Discord.MessageReaction} reaction @param {Discord.User} user*/
                    const filter = (reaction, user) => reaction.users.cache.has(client.user.id);
                    const collector = embedMessage.createReactionCollector(filter);
                    if (args.length > 0 && args[0] !== 'all') {
                        if (args.some(region => region.includes('eu'))) {
                            await embedMessage.react(emojiCharacters['EU']);
                        }
                        if (args.some(region => region.includes('na'))) {
                            await embedMessage.react(emojiCharacters['NA']);
                        }
                        if (args.some(region => region.includes('sa'))) {
                            await embedMessage.react(emojiCharacters['SA']);
                        }
                        if (args.some(region => region.includes('asia'))) {
                            await embedMessage.react(emojiCharacters['ASIA']);
                        }
                        if (args.some(region => region.includes('sea'))) {
                            await embedMessage.react(emojiCharacters['SEA']);
                        }
                        if (args.some(region => region.includes('oce'))) {
                            await embedMessage.react(emojiCharacters['OCE']);
                        }
                        if (args.some(region => region.includes('kr'))) {
                            await embedMessage.react(emojiCharacters['KR']);
                        }
                    }
                    else {
                        await embedMessage.react(emojiCharacters['EU']);
                        await embedMessage.react(emojiCharacters['NA']);
                        await embedMessage.react(emojiCharacters['SA']);
                        await embedMessage.react(emojiCharacters['ASIA']);
                        await embedMessage.react(emojiCharacters['SEA']);
                        await embedMessage.react(emojiCharacters['OCE']);
                        await embedMessage.react(emojiCharacters['KR']);
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
                        let winReact;

                        switch (reactionID) {
                            case emojiCharacters['EU']:
                                winReact = `${reactionID} for Europe`;
                                break;
                            case emojiCharacters['NA']:
                                winReact = `${reactionID} for North America`;
                                break;
                            case emojiCharacters['SA']:
                                winReact = `${reactionID} for South America`;
                                break;
                            case emojiCharacters['ASIA']:
                                winReact = `${reactionID} for Asia`;
                                break;
                            case emojiCharacters['SEA']:
                                winReact = `${reactionID} for Southeast Asia`;
                                break;
                            case emojiCharacters['OCE']:
                                winReact = `${reactionID} for Oceania`;
                                break;
                            case emojiCharacters['KR']:
                                winReact = `${reactionID} for Korea/Japan`;
                                break;
                        }

                        let regionResult;

                        if (draws.length > 1) {
                            regionResult = {
                                color: 0x009900,
                                title: `${title}`,
                                fields: [
                                    {
                                        name: 'Draws',
                                        value: `${draws.join(' ')}`,
                                        inline: true
                                    },
                                    {
                                        name: `${winValue}`,
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
                            regionResult = {
                                color: 0x009900,
                                title: `${title}`,
                                fields: [
                                    {
                                        name: `${winValue}`,
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
                        games_channel.send({ embed: regionResult });
                        if (config.host_channel_messages === true) {
                            host_channel.send({ embed: regionResult });
                        }
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

    // Post the message and set up the reactions
};
