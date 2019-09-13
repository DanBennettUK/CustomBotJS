exports.run = async (client, message, args) => {

    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    // Get customRole for pinging later
    const customRole = message.guild.roles.get(client.config.custom_role_id);

    const message_squad_sizes = args;
    const emojiCharacters = require('../emojiCharacters.js');
    const host_channel = client.channels.get(client.config.host_channel_id);
    const games_channel = client.channels.get(client.config.games_channel_id);
    const timer = client.config.default_timer;
    let error_message;

    // Set up the message as an embed, ready to post
    const title = 'Vote for squad size!';
    const description = 'Please vote on the squad size for the next game';
    const winText = 'The winning squad size is:';
    let timerText;

    // Function to compare two arrays
    function containsAny(source, target) {
        const result = source.filter(function(item) {
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
            },
        ],
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
        },
    };

    // Function to send the squad vote messages
    async function squadTryMessage(squad_sizes) {
        try {
            await games_channel
                .send({ embed: squadVoteMessage })
                .then(async embedMessage => {
                    for (let i = 0; i < squad_sizes.length; i++) {
                        await embedMessage.react(
                            emojiCharacters[squad_sizes[i]]
                        );
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
                                }, client.config.default_timer * 60 * 1000)
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
                        let winReact = reactionID;

                        const squadResult = {
                            color: 0x009900,
                            title: `${title}`,
                            fields: [
                                {
                                    name: `${winText}`,
                                    value: `${winReact}`,
                                },
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: client.user.avatarURL,
                            },
                        };

                        embedMessage.delete();
                        games_channel.send({ embed: squadResult });
                        if (client.config.host_channel_messages === true) {
                            host_channel.send({ embed: squadResult });
                        }

                        let channelSize;

                        squad_sizes.forEach(size => {
                            if (winReact == emojiCharacters[size]) {
                                channelSize = parseInt(size);
                                return;
                            }
                        });
                            
                        client.channels.forEach(channel => {
                            if (channel.type == 'voice') {
                                if (
                                    channel.name.startsWith(client.config.voice_channel_emoji)
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
                    }, client.config.default_timer * 60 * 1000);
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
