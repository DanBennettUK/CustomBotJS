exports.run = async (client, message, args) => {

    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    
    const host_channel = client.channels.get(client.config.host_channel_id);
    const games_channel = client.channels.get(client.config.games_channel_id);
    const countdownText = 'The countdown will end in';
    const countdownEndText = 'Countdown Ended!';
    let timerText;
    let timer = client.config.default_timer;

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

    const countdownEmbed = {
        color: 0x3366ff,
        title: `${countdownText}`,
        description: `${timer} ${timerText}`,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
        },
    };

    try {
        await games_channel
            .send({ embed: countdownEmbed })
            .then(async embedMessage => {
                const countdownInterval = setTimeout(function() {
                    const countdownEndedEmbed = {
                        color: 0x009900,
                        title: `${countdownEndText}`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                        },
                    };
                    embedMessage.delete();
                    games_channel.send({ embed: countdownEndedEmbed });
                    if (client.config.host_channel_messages === true) {
                        host_channel.send(`${countdownEndText}`);
                    }
                }, timer * 60 * 100);
            // Checks if message is deleted
            const checkIfDeleted = setInterval(function() {
                if (embedMessage.deleted) {
                    clearInterval(checkIfDeleted);
                    clearTimeout(countdownInterval);
                }
            }, 1000);
        });
    }
    catch (error) {
        console.log(`${error}`);
    }
};
