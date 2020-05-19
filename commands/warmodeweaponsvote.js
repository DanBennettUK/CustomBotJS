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
    const title = 'Vote for War Mode Weapons!';
    const description = 'Please vote on the weapons for the next warmode game!';
    const winValue = 'The winning weapon choice is:';
    let timer = config.default_timer;
    let timerText;

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

    const warmodewepChoices = [
        `${emojiCharacters[1]} for Default Weapons`,
        `${emojiCharacters[2]} for Bomb Kit (Throwables)`,
        `${emojiCharacters[3]} for VSS Kit`,
        `${emojiCharacters[4]} for OP Kit (Crate Weapons)`,
        `${emojiCharacters[5]} for Sniper Kit`
    ];

    const choices = `${warmodewepChoices.join('\n')}\n**NOTE:** Default Weapons => Can customize everything, others are preset`;

    const warmodewepsVote = {
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
        const ramdomeWarmodeWeaponChoices = {
            color: 0x3366ff,
            title: `Random War Mode weapon selection`,
            description: `The War Mode weapon kit for the next game will be randomly selected`,
            fields: [
                {
                    name: 'Choices',
                    value: choices,
                    inline: true
                },
                {
                    name: 'Selection',
                    value: warmodewepChoices[Math.floor(Math.random() * Math.floor(warmodewepChoices.length))],
                    inline: true
                }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.displayAvatarURL(),
            }
        };
        games_channel.send({ embed: ramdomeWarmodeWeaponChoices }).catch(console.error);
        if (config.host_channel_messages === true) {
            host_channel.send({ embed: ramdomeWarmodeWeaponChoices }).catch(console.error);
        }
    }
    else {
        try {
            await games_channel
                .send({ embed: warmodewepsVote })
                .then(async embedMessage => {
                    /**@param {Discord.MessageReaction} reaction @param {Discord.User} user*/
                    const filter = (reaction, user) => reaction.users.cache.has(client.user.id);
                    const collector = embedMessage.createReactionCollector(filter);
                    await embedMessage.react(emojiCharacters[1]);
                    await embedMessage.react(emojiCharacters[2]);
                    await embedMessage.react(emojiCharacters[3]);
                    await embedMessage.react(emojiCharacters[4]);
                    await embedMessage.react(emojiCharacters[5]);
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
                            case emojiCharacters['1']:
                                winReact = `${reactionID} for Default Weapons`;
                                break;
                            case emojiCharacters['2']:
                                winReact = `${reactionID} for Bomb Kit (Throwables)`;
                                break;
                            case emojiCharacters['3']:
                                winReact = `${reactionID} for VSS Kit`;
                                break;
                            case emojiCharacters['4']:
                                winReact = `${reactionID} for OP Kit (Crate Weapons)`;
                                break;
                            case emojiCharacters['5']:
                                winReact = `${reactionID} for Sniper Kit`;
                        }

                        let warmodewepsResult;

                        if (draws.length > 1) {
                            warmodewepsResult = {
                                color: 0x009900,
                                title: `${title}`,
                                description: '',
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
                            warmodewepsResult = {
                                color: 0x009900,
                                title: `${title}`,
                                description: '',
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
                        games_channel.send({ embed: warmodewepsResult });
                        if (config.host_channel_messages === true) {
                            host_channel.send({ embed: warmodewepsResult });
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
};
