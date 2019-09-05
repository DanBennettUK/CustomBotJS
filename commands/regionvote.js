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

    // Set up the message as an embed, ready to post
    const title = 'Vote for region!';
    const description = 'Please vote on the region for tonights games!';
    const winValue = 'The winning region was:';
    let timer = client.config.default_timer;
    let regionChoices = [];
    let timerText;

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
    }

    if (timer === '1') {
        timerText = 'minute';
    }
    else {
        timerText = 'minutes';
    }

    if (args.length > 0 && args[0] !== 'all') {
        let i = 0;
        if (args.some(region => region.includes('eu'))) {
            regionChoices[i] = `${emojiCharacters['EU']} for Europe`;
            i++;
        }
        if (args.some(region => region.includes('na'))) {
            regionChoices[i] = `${emojiCharacters['NA']} for North America`;
            i++;
        }
        if (args.some(region => region.includes('sea'))) {
            regionChoices[i] = `${emojiCharacters['SEA']} for Southeast Asia`;
            i++;
        }
        if (args.some(region => region.includes('oce'))) {
            regionChoices[i] = `${emojiCharacters['OCE']} for Oceania`;
            i++;
        }
        if (args.some(region => region.includes('kr'))) {
            regionChoices[i] = `${emojiCharacters['KR']} for Korea/Japan`;
        }
    }
    else {
        regionChoices = [
            `${emojiCharacters['EU']} for Europe`,
            `${emojiCharacters['NA']} for North America`,
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
            icon_url: client.user.avatarURL,
        },
    };

    try {
        await games_channel
            .send({ embed: regionVoteMessage })
            .then(async embedMessage => {
                // Checks if message is deleted
                const checkIfDeleted = setInterval(function() {
                    if (embedMessage.deleted) {
                        clearTimeout(timeToVote);
                        clearInterval(checkIfDeleted);
                    }
                }, 1000);

                if (args.length > 0 && args[0] !== 'all') {
                    if (args.some(region => region.includes('eu'))) {
                        await embedMessage.react(emojiCharacters['EU']);
                    }
                    if (args.some(region => region.includes('na'))) {
                        await embedMessage.react(emojiCharacters['NA']);
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
                    await embedMessage.react(emojiCharacters['SEA']);
                    await embedMessage.react(emojiCharacters['OCE']);
                    await embedMessage.react(emojiCharacters['KR']);
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
                const timeToVote = setTimeout(function() {
                    const reactions = embedMessage.reactions;
                    let reactionID;
                    let maxCount = 0;
                    reactions.some((r, i) => {
                        console.log(`R:${r.emoji}\ncount:${r.count}\nmax:${maxCount}\ni:${i}\n`)
                        if (r.count > maxCount) {
                            maxCount = r.count;
                            reactionID = i;
                        }
                    });
                    let draws = [];
                    reactions.some((r, i) => {
                        console.log(`R:${r.emoji}\ncount:${r.count}\nmax:${maxCount}\ni:${i}\n`)
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

                    const regionResult = {
                        color: 0x009900,
                        title: `${title}`,
                        fields: [
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
                    games_channel.send({ embed: regionResult });
                    if (client.config.host_channel_messages === true) {
                        host_channel.send({ embed: regionResult });
                    }
                }, timer * 60 * 1000);
            });
    }
    catch (error) {
        console.log(`${error}`);
    }

    // Post the message and set up the reactions
};
