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
    const title = 'Vote for perspective!';
    const description = 'Please vote on the perspective for the next game!';
    const winValue = 'The winning perspective was:';
    let timer = client.config.default_timer;
    let timerText;

    if (args.length > 0) {
        if (parseInt(args[args.length - 1]) || args[args.length - 1] == 0) {
            if (args[args.length - 1] > 0) {
                timer = parseInt(args[args.length - 1]);
            }
            args.splice(args.length - 1, 1);
        }
    }

    if (timer == 1) {
        timerText = 'minute';
    }
    else {
        timerText = 'minutes';
    }

    const perspectiveVote = {
        color: 0x3366ff,
        title: `${title}`,
        description: `${description}`,
        fields: [
            {
                name: 'Choose a reaction',
                value: `${emojiCharacters[1]} for FPP \n${
                    emojiCharacters[3]
                } for TPP`,
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
            .send({ embed: perspectiveVote })
            .then(async embedMessage => {
                await embedMessage.react(emojiCharacters[1]);
                await embedMessage.react(emojiCharacters[3]);
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

                    const perspectiveResult = {
                        color: 0x009900,
                        title: `${title}`,
                        description: '',
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
                    games_channel.send({ embed: perspectiveResult });
                    if (client.config.host_channel_messages === true) {
                        host_channel.send(
                            `${winValue} ${winReact.emoji}`
                        );
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

    // Post the message and set up the perspectives
};
