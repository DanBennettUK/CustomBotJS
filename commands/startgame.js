exports.run = async (client, message, args) => {
    const host_channel = client.channels.get(client.config.host_channel_id);
    const games_channel = client.channels.get(client.config.games_channel_id);
    const startingGameText = 'The game will start in';
    const gameStarted = 'Game Started!';
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

    if (timer === '1') {
        timerText = 'minute';
    }
    else {
        timerText = 'minutes';
    }

    const startGameEmbed = {
        color: 0x3366ff,
        title: `${startingGameText}`,
        description: `${timer} ${timerText}`,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
        },
    };

    try {
        await games_channel
            .send({ embed: startGameEmbed })
            .then(async embedMessage => {
                setTimeout(function() {
                    // Checks if message is deleted
                    const checkIfDeleted = setInterval(function() {
                        if (embedMessage.deleted) {
                            clearInterval(checkIfDeleted);
                        }
                    }, 1000);
                    const gameStartedEmbed = {
                        color: 0x009900,
                        title: `${gameStarted}`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                        },
                    };
                    embedMessage.delete();
                    games_channel.send({ embed: gameStartedEmbed });
                    if (client.config.host_channel_messages === true) {
                        host_channel.send(`${gameStarted}`);
                    }
                }, timer * 60 * 1000);
            });
    }
    catch (error) {
        console.log(`${error}`);
    }
};