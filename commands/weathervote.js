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
    const title = 'Vote for weather!';
    const description = 'Please vote on the weather for the next game!';
    const winValue = 'The winning weather was:';
    let weatherChoices = [];

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

    if (args.length > 0) {
        if (!['all', 'erangel', 'miramar', 'sanhok', 'vikendi'].includes(args[0])) {
            let i = 0;
            if (args.some(weather => weather.includes('sunny'))) {
                weatherChoices[i] = `${emojiCharacters['Sunny']} for Sunny`;
                i++;
            }
            if (args.some(weather => weather.includes('rainy'))) {
                weatherChoices[i] = `${emojiCharacters['Rainy']} for Rainy`;
                i++;
            }
            if (args.some(weather => weather.includes('clear'))) {
                weatherChoices[i] = `${emojiCharacters['Clear']} for Sunny Clear`;
                i++;
            }
            if (args.some(weather => weather.includes('sunset'))) {
                weatherChoices[i] = `${emojiCharacters['Sunset']} for Sunset`;
                i++;
            }
            if (args.some(weather => weather.includes('foggy'))) {
                weatherChoices[i] = `${emojiCharacters['Foggy']} for Foggy`;
                i++;
            }
            if (args.some(weather => weather.includes('overcast'))) {
                weatherChoices[i] = `${emojiCharacters['Overcast']} for Overcast`;
                i++;
            }
            if (args.some(weather => weather.includes('sunrise'))) {
                weatherChoices[i] = `${emojiCharacters['Sunrise']} for Sunrise`;
                i++;
            }
            if (args.some(weather => weather.includes('snowy'))) {
                weatherChoices[i] = `${emojiCharacters['Snowy']} for Snowy`;
                i++;
            }
            if (args.some(weather => weather.includes('moonlight'))) {
                weatherChoices[i] = `${emojiCharacters['Moonlight']} for Moonlight`;
            }
        }
        else if (args[0] === 'erangel') {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Rainy']} for Rainy`,
                `${emojiCharacters['Clear']} for Sunny Clear`,
                `${emojiCharacters['Sunset']} for Sunset`,
                `${emojiCharacters['Foggy']} for Foggy`,
                `${emojiCharacters['Overcast']} for Overcast`
            ];
        }
        else if (args[0] === 'miramar') {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Sunrise']} for Sunrise`,
                `${emojiCharacters['Sunset']} for Sunset`,
                `${emojiCharacters['Rainy']} for Rainy`,
                `${emojiCharacters['Foggy']} for Foggy`,
                `${emojiCharacters['Overcast']} for Overcast`
            ];
        }
        else if (args[0] === 'sanhok') {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Rainy']} for Rainy`,
                `${emojiCharacters['Foggy']} for Foggy`,
                `${emojiCharacters['Overcast']} for Overcast`
            ];
        }
        else if (args[0] === 'vikendi') {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Moonlight']} for Moonlight`,
                `${emojiCharacters['Snowy']} for Snowy`
            ];
        }
        else {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Rainy']} for Rainy`,
                `${emojiCharacters['Clear']} for Sunny Clear`,
                `${emojiCharacters['Sunset']} for Sunset`,
                `${emojiCharacters['Foggy']} for Foggy`,
                `${emojiCharacters['Overcast']} for Overcast`,
                `${emojiCharacters['Sunrise']} for Sunrise`,
                `${emojiCharacters['Moonlight']} for Moonlight`,
                `${emojiCharacters['Snowy']} for Snowy`
            ];
        }
    } else {
        weatherChoices = [
            `${emojiCharacters['Sunny']} for Sunny`,
            `${emojiCharacters['Rainy']} for Rainy`,
            `${emojiCharacters['Clear']} for Sunny Clear`,
            `${emojiCharacters['Sunset']} for Sunset`,
            `${emojiCharacters['Foggy']} for Foggy`,
            `${emojiCharacters['Overcast']} for Overcast`,
            `${emojiCharacters['Sunrise']} for Sunrise`,
            `${emojiCharacters['Moonlight']} for Moonlight`,
            `${emojiCharacters['Snowy']} for Snowy`
        ];
    }
    const choices = weatherChoices.join('\n');

    const weatherVoteMessage = {
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
            .send({ embed: weatherVoteMessage })
            .then(async embedMessage => {
                // Checks if message is deleted
                const checkIfDeleted = setInterval(function() {
                    if (embedMessage.deleted) {
                        clearTimeout(timeToVote);
                        clearInterval(checkIfDeleted);
                    }
                }, 1000);

                if (args.length > 0) {
                    if (!['all', 'erangel', 'miramar', 'sanhok', 'vikendi'].includes(args[0])) {
                        if (args.some(weather => weather.includes('sunny'))) {
                            await embedMessage.react(emojiCharacters['Sunny']);
                        }
                        if (args.some(weather => weather.includes('rainy'))) {
                            await embedMessage.react(emojiCharacters['Rainy']);
                        }
                        if (args.some(weather => weather.includes('clear'))) {
                            await embedMessage.react(emojiCharacters['Clear']);
                        }
                        if (args.some(weather => weather.includes('sunset'))) {
                            await embedMessage.react(emojiCharacters['Sunset']);
                        }
                        if (args.some(weather => weather.includes('foggy'))) {
                            await embedMessage.react(emojiCharacters['Foggy']);
                        }
                        if (args.some(weather => weather.includes('overcast'))) {
                            await embedMessage.react(emojiCharacters['Overcast']);
                        }
                        if (args.some(weather => weather.includes('sunrise'))) {
                            await embedMessage.react(emojiCharacters['Sunrise']);
                        }
                        if (args.some(weather => weather.includes('moonlight'))) {
                            await embedMessage.react(emojiCharacters['Moonlight']);
                        }
                        if (args.some(weather => weather.includes('snowy'))) {
                            await embedMessage.react(emojiCharacters['Snowy']);
                        }
                    }
                    else if (args[0] === 'erangel') {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Rainy']);
                        await embedMessage.react(emojiCharacters['Clear']);
                        await embedMessage.react(emojiCharacters['Sunset']);
                        await embedMessage.react(emojiCharacters['Foggy']);
                        await embedMessage.react(emojiCharacters['Overcast']);
                    }
                    else if (args[0] === 'miramar') {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Sunrise']);
                        await embedMessage.react(emojiCharacters['Sunset']);
                        await embedMessage.react(emojiCharacters['Rainy']);
                        await embedMessage.react(emojiCharacters['Foggy']);
                        await embedMessage.react(emojiCharacters['Overcast']);
                    }
                    else if (args[0] === 'sanhok') {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Rainy']);
                        await embedMessage.react(emojiCharacters['Foggy']);
                        await embedMessage.react(emojiCharacters['Overcast']);
                    }
                    else if (args[0] === 'vikendi') {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Moonlight']);
                        await embedMessage.react(emojiCharacters['Snowy']);
                    }
                    else {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Rainy']);
                        await embedMessage.react(emojiCharacters['Clear']);
                        await embedMessage.react(emojiCharacters['Sunset']);
                        await embedMessage.react(emojiCharacters['Foggy']);
                        await embedMessage.react(emojiCharacters['Overcast']);
                        await embedMessage.react(emojiCharacters['Sunrise']);
                        await embedMessage.react(emojiCharacters['Moonlight']);
                        await embedMessage.react(emojiCharacters['Snowy']);
                    }
                } else {
                    await embedMessage.react(emojiCharacters['Sunny']);
                    await embedMessage.react(emojiCharacters['Rainy']);
                    await embedMessage.react(emojiCharacters['Clear']);
                    await embedMessage.react(emojiCharacters['Sunset']);
                    await embedMessage.react(emojiCharacters['Foggy']);
                    await embedMessage.react(emojiCharacters['Overcast']);
                    await embedMessage.react(emojiCharacters['Sunrise']);
                    await embedMessage.react(emojiCharacters['Moonlight']);
                    await embedMessage.react(emojiCharacters['Snowy']);
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
                    const reactions = embedMessage.reactions.array();
                    let reactionID;
                    let maxCount = 0;
                    for (let i = 0; i < reactions.length; i++) {
                        if (reactions[i].count > maxCount) {
                            maxCount = reactions[i].count;
                            reactionID = i;
                        }
                    }
                    const draws = [];
                    for (let i = 0, j = 0; i < reactions.length; i++) {
                        if (reactions[i].count == maxCount) {
                            draws[j] = i;
                            j++;
                        }
                    }
                    if (draws.length > 1) {
                        reactionID =
                            draws[
                                Math.floor(
                                    Math.random() * Math.floor(draws.length)
                                )
                            ];
                    }

                    const weatherResult = {
                        color: 0x009900,
                        title: `${title}`,
                        fields: [
                            {
                                name: 'Choices:',
                                value: choices,
                            },
                            {
                                name: `${winValue}`,
                                value: `${reactions[reactionID].emoji}`,
                            },
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                        },
                    };

                    embedMessage.delete();
                    games_channel.send({ embed: weatherResult });
                    if (client.config.host_channel_messages === true) {
                        host_channel.send({ embed: weatherResult });
                    }
                }, timer * 60 * 1000);
            });
    } catch (error) {
        console.log(`${error}`);
    }
}