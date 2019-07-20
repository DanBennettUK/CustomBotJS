exports.run = async (client, message, args) => {

    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    
    const host_channel = client.channels.get(client.config.host_channel_id);
    const games_channel = client.channels.get(client.config.games_channel_id);
    const customRole = message.guild.roles.get(client.config.custom_role_id);
    const emojiCharacters = require('../emojiCharacters.js');
    let timerText;
    let timer = client.config.default_timer;

    const title = 'Vote for game type!';
    const description = 'Please vote on the game type for the next game!';
    const winValue = 'The winning game type was:';


    if (args.length > 0) {
        timer = args[0];
    }

    if (timer === '1') timerText = 'minute';
    else timerText = 'minutes';

    const choices = 
    `${emojiCharacters['WarMode']} for War Mode
    ${emojiCharacters['Conquest']} for War Mode Conquest`;

    const warmodeGametypeMessage = {
        color: 0x3366ff,
        title: `${title}`,
        description: `${description}`,
        fields: [
            {
                name: 'Choose a reaction',
                value: choices
            },
            {
                name: 'Vote will close in:',
                value: `${timer} ${timerText}`
            }
        ],
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
        }
    };

    try {
        await games_channel
            .send({ embed: warmodeGametypeMessage })
            .then(async embedMessage => {
                // Checks if message is deleted
                const checkIfDeleted = setInterval(function() {
                    if (embedMessage.deleted) {
                        clearTimeout(timeToVote);
                        clearInterval(checkIfDeleted);
                    }
                }, 1000);
                await embedMessage.react(emojiCharacters['WarMode']);
                await embedMessage.react(emojiCharacters['Conquest']);
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

                    const gametypeResult = {
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
                    games_channel.send({ embed: gametypeResult });
                    if (client.config.host_channel_messages === true) {
                        host_channel.send({ embed: gametypeResult });
                    }
                }, timer * 60 * 1000);
            });
        } 
        catch (error) {
            console.log(`${error}`);
        }
}