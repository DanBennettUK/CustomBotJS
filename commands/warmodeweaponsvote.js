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
    const title = 'Vote for War Mode Weapons!';
    const description = 'Please vote on the weapons for the next warmode game!';
    const winValue = 'The winning weapon choice was:';
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

    const warmodewepChoices = [
        `${emojiCharacters[1]} for Default Weapons`,
        `${emojiCharacters[2]} for Bomb Kit (Throwables)`,
        `${emojiCharacters[3]} for VSS Kit`,
        `${emojiCharacters[4]} for OP Kit (Crate Weapons)`,
        `${emojiCharacters[5]} for Sniper Kit`,
        `**NOTE:** Default Weapons => Can customize everything, others are preset`
    ];

    const choices = warmodewepChoices.join('\n');

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
            icon_url: client.user.avatarURL,
        },
    };

    try {
        await games_channel
            .send({ embed: warmodewepsVote })
            .then(async embedMessage => {
                await embedMessage.react(emojiCharacters[1]);
                await embedMessage.react(emojiCharacters[2]);
                await embedMessage.react(emojiCharacters[3]);
                await embedMessage.react(emojiCharacters[4]);
                await embedMessage.react(emojiCharacters[5]);
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
                    reactions.forEach(r => {
                        console.log(`MessageId:${embedMessage.id}\nR:${r.emoji.name}\ncount:${r.count}\nmax:${maxCount}\n`);
                        if (r.count > maxCount) {
                            maxCount = r.count;
                            reactionID = r.emoji.name;
                        }
                    });
                    let draws = [];
                    reactions.forEach(r => {
                        console.log(`MessageId:${embedMessage.id}\nR:${r.emoji.name}\ncount:${r.count}\nmax:${maxCount}\n`);
                        if (r.count == maxCount) {
                            draws.push(r.emoji.name);
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
                    let winReact;

                    switch(reactionID) {
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

                    const warmodewepsResult = {
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
                            icon_url: client.user.avatarURL,
                        },
                    };

                    embedMessage.delete();
                    games_channel.send({ embed: warmodewepsResult });
                    if (client.config.host_channel_messages === true) {
                        host_channel.send({ embed: warmodewepsResult });
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
};
