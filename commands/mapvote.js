exports.run = async (client, message, args) => {

    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    // Get customRole for pinging later
    const customRole = message.guild.roles.get(client.config.custom_role_id);

    const emojiCharacters = require('../emojiCharacters.js');
    const host_channel = client.channels.get(client.config.host_channel_id);
    const games_channel = client.channels.get(client.config.games_channel_id);
    let timer = client.config.default_timer;
    let timerText;

    // Set up the message as an embed, ready to post
    const title = 'Vote for map!';
    const description = 'Please vote on the map for the next game!';
    const winValue = 'The winning map was:';
    let mapChoices = [];

    args.forEach(function(arg, i) {
        args[i] = arg.toLowerCase();
    });

    if (args.length > 0) {
        if (parseInt(args[args.length - 1]) || args[args.length - 1] == 0) {
            if (args[args.length - 1] > 0) {
                timer = parseInt(args[args.length - 1]);
            }
            args.splice(args.length - 1, 1);
        }
        if (args[0] === 'wm') args[0] = 'warmode';
    }

    if (timer == 1) {
        timerText = 'minute';
    }
    else {
        timerText = 'minutes';
    }
    if (args.length > 0) {
        if (args[0] !== 'all' && args[0] !== 'warmode') {
            let i = 0;
            if (args.some(map => map.includes('erangel'))) {
                mapChoices[i] = `${emojiCharacters['Erangel']} for Erangel`;
                i++;
            }
            if (args.some(map => map.includes('miramar'))) {
                mapChoices[i] = `${emojiCharacters['Miramar']} for Miramar`;
                i++;
            }
            if (args.some(map => map.includes('sanhok'))) {
                mapChoices[i] = `${emojiCharacters['Sanhok']} for Sanhok`;
                i++;
            }
            if (args.some(map => map.includes('vikendi'))) {
                mapChoices[i] = `${emojiCharacters['Vikendi']} for Vikendi`;
            }
        }
        else if (args[0] === 'warmode') {
            if (!args.some(map => ['erangel', 'miramar', 'sanhok', 'vikendi'].includes(map))) {
                mapChoices = [
                    `${emojiCharacters['Erangel']} for Erangel`,
                    `${emojiCharacters['Miramar']} for Miramar`,
                    `${emojiCharacters['Sanhok']} for Sanhok`,
                    `${emojiCharacters['Vikendi']} for Vikendi`,
                    `${emojiCharacters['Jackal']} for Camp Jackal`
                ];
            } else {
                let i = 0;
                if (args.some(map => map.includes('erangel'))) {
                    mapChoices[i] = `${emojiCharacters['Erangel']} for Erangel`;
                    i++;
                }
                if (args.some(map => map.includes('miramar'))) {
                    mapChoices[i] = `${emojiCharacters['Miramar']} for Miramar`;
                    i++;
                }
                if (args.some(map => map.includes('sanhok'))) {
                    mapChoices[i] = `${emojiCharacters['Sanhok']} for Sanhok`;
                    i++;
                }
                if (args.some(map => map.includes('vikendi'))) {
                    mapChoices[i] = `${emojiCharacters['Vikendi']} for Vikendi`;
                }
                if (args.some(map => map.includes('jackal'))) {
                    mapChoices[i] = `${emojiCharacters['Jackal']} for Camp Jackal`;
                }
            }
        } 
        else {
            mapChoices = [
                `${emojiCharacters['Erangel']} for Erangel`,
                `${emojiCharacters['Miramar']} for Miramar`,
                `${emojiCharacters['Sanhok']} for Sanhok`,
                `${emojiCharacters['Vikendi']} for Vikendi`,
            ];
        }
    }
    else {
        mapChoices = [
            `${emojiCharacters['Erangel']} for Erangel`,
            `${emojiCharacters['Miramar']} for Miramar`,
            `${emojiCharacters['Sanhok']} for Sanhok`,
            `${emojiCharacters['Vikendi']} for Vikendi`,
        ];
    }
    const choices = mapChoices.join('\n');

    const mapVoteMessage = {
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
            icon_url: client.user.avatarURL,
        },
    };

    try {
        await games_channel
            .send({ embed: mapVoteMessage })
            .then(async embedMessage => {
                if (args.length > 0) {
                    if (args[0] !== 'all' && args[0] !== 'warmode') {
                        if (args.some(map => map.includes('erangel'))) {
                            await embedMessage.react(emojiCharacters['Erangel']);
                        }
                        if (args.some(map => map.includes('miramar'))) {
                            await embedMessage.react(emojiCharacters['Miramar']);
                        }
                        if (args.some(map => map.includes('sanhok'))) {
                            await embedMessage.react(emojiCharacters['Sanhok']);
                        }
                        if (args.some(map => map.includes('vikendi'))) {
                            await embedMessage.react(emojiCharacters['Vikendi']);
                        }
                    }
                    else if (args[0] === 'warmode') {
                        if (!args.some(map => ['erangel', 'miramar', 'sanhok', 'vikendi'].includes(map))) {
                            await embedMessage.react(emojiCharacters['Erangel']);
                            await embedMessage.react(emojiCharacters['Miramar']);
                            await embedMessage.react(emojiCharacters['Sanhok']);
                            await embedMessage.react(emojiCharacters['Vikendi']);
                            await embedMessage.react(emojiCharacters['Jackal']);
                        } else {
                            if (args.some(map => map.includes('erangel'))) {
                                await embedMessage.react(emojiCharacters['Erangel']);
                            }
                            if (args.some(map => map.includes('miramar'))) {
                                await embedMessage.react(emojiCharacters['Miramar']);
                            }
                            if (args.some(map => map.includes('sanhok'))) {
                                await embedMessage.react(emojiCharacters['Sanhok']);
                            }
                            if (args.some(map => map.includes('vikendi'))) {
                                await embedMessage.react(emojiCharacters['Vikendi']);
                            }
                            if (args.some(map => map.includes('jackal'))) {
                                await embedMessage.react(emojiCharacters['Jackal']);
                            }
                        }
                    } 
                    else {
                        await embedMessage.react(emojiCharacters['Erangel']);
                        await embedMessage.react(emojiCharacters['Miramar']);
                        await embedMessage.react(emojiCharacters['Sanhok']);
                        await embedMessage.react(emojiCharacters['Vikendi']);
                    }
                }
                else {
                    await embedMessage.react(emojiCharacters['Erangel']);
                    await embedMessage.react(emojiCharacters['Miramar']);
                    await embedMessage.react(emojiCharacters['Sanhok']);
                    await embedMessage.react(emojiCharacters['Vikendi']);
                }
                if (client.config.custom_role_ping == true) {
                    await customRole
                        .setMentionable(true, 'Role needs to be pinged')
                        .catch(console.error);
                    await games_channel
                        .send(customRole + ' - get voting!')
                        .then(msg =>
                            setTimeout(function() {
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
                const timeToVote = setTimeout(async function() {
                    const reactions = await embedMessage.reactions;
                    let reactionID;
                    let maxCount = 0;
                    reactions.some((r, i) => {
                        console.log(`MessageId:${embedMessage.id}\nR:${r.emoji}\ncount:${r.count}\nmax:${maxCount}\ni:${i}\n`);
                        if (r.count > maxCount) {
                            maxCount = r.count;
                            reactionID = i;
                        }
                    });
                    let draws = [];
                    reactions.some((r, i) => {
                        console.log(`MessageId:${embedMessage.id}\nR:${r.emoji}\ncount:${r.count}\nmax:${maxCount}\ni:${i}\n`);
                        if (r.count == maxCount) {
                            draws.push(i);
                        }
                    });
                    console.log(`Draws: ${draws}\n`);
                    if (draws.length > 1) {
                        reactionID =
                            draws[
                                Math.floor(
                                    Math.random() * Math.floor(draws.length)
                                )
                            ];
                    }
                    const winReact = reactions.find(r => r.emoji == reactionID);

                    const mapResult = {
                        color: 0x009900,
                        title: `${title}`,
                        fields: [
                            {
                                name: 'Choices:',
                                value: choices,
                            },
                            {
                                name: `${winValue}`,
                                value: `${winReact.emoji}`,
                            },
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                        },
                    };

                    embedMessage.delete();
                    games_channel.send({ embed: mapResult });
                    if (client.config.host_channel_messages === true) {
                        host_channel.send({ embed: mapResult });
                    }
                }, timer * 60 * 1000);
                // Checks if message is deleted
                const checkIfDeleted = setInterval(function() {
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

    // Post the message and set up the reactions
};
