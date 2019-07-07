exports.run = async (client, message, args) => {
    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    // Get customRole for pinging later
    const customRole = message.guild.roles.get(client.config.custom_role_id);
    const subscriberRole = message.guild.roles.get(
        client.config.subscriber_role_id
    );
    const host_channel = client.channels.get(client.config.host_channel_id);
    const games_channel = client.channels.get(client.config.games_channel_id);
    const subscriber_channel = client.channels.get(
        client.config.subscriber_channel_id
    );
    const title = 'Custom Game Server Details';

    let serverPassword = args[0];
    let timer = args[1];
    let serverName = args[2];
    let raiseError = false;
    let timeLeft;
    let timerText;
    let missingText = '';

    if (typeof serverPassword === 'undefined') {
        if (client.config.default_game_server_password !== '') {
            serverPassword = client.config.default_game_server_password;
        }
        else {
            raiseError = true;
            missingText = missingText + 'Password is missing!\n';
        }
    }
    if (typeof serverName === 'undefined') {
        if (client.config.default_game_server_name !== '') {
            serverName = client.config.default_game_server_name;
        }
        else {
            raiseError = true;
            missingText = missingText + 'Server Name is missing!\n';
        }
    }

    if (typeof timer === 'undefined') {
        timer = client.config.default_timer;
    }
    else if (isNaN(timer)) {
        raiseError = true;
        missingText = missingText + 'Minutes is missing or not a number!\n';
    }

    if (raiseError === true) {
        const error = {
            color: 0xff0000,
            title: 'Error!',
            fields: [
                {
                    name: 'One or more of your arguments are wrong',
                    value:
                        'Ensure you follow the correct format: \n<password> [minutes] [servername] \nOptions in []\'s are only optional if a default is set',
                },
                {
                    name: 'Errors:',
                    value: missingText,
                },
            ],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
            },
        };
        host_channel.send({ embed: error });
        return;
    }
    else {
        timeLeft = timer;
    }

    if (timer === '1') {
        timerText = 'minute';
    }
    else {
        timerText = 'minutes';
    }

    const passwordMessage = {
        color: 0x009900,
        title: `${title}`,
        fields: [
            {
                name: 'Server Name:',
                value: `${serverName}`,
            },
            {
                name: 'Password:',
                value: `${serverPassword}`,
            },
        ],
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
        },
    };

    const prePasswordMessage = {
        color: 0x3366ff,
        title: `${title}`,
        fields: [
            {
                name: 'The password will be posted in:',
                value: `${timeLeft} ${timerText}!`,
            },
        ],
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
        },
    };

    try {
        if (subscriber_channel != '') {
            await subscriber_channel.send({
                embed: passwordMessage,
            });
            await subscriberRole
                .setMentionable(true, 'Role needs to be pinged')
                .catch(console.error);
            await subscriber_channel.send(
                subscriberRole + ' - the password is above!'
            );
            await subscriberRole
                .setMentionable(false, 'Role no longer needs to be pinged')
                .catch(console.error);
        }
        await games_channel
            .send({ embed: prePasswordMessage })
            .then(async embedMessage => {
                // Checks if message is deleted
                const checkIfDeleted = setInterval(function() {
                    if (embedMessage.deleted) {
                        clearTimeout(timeToVote);
                        clearInterval(checkIfDeleted);
                    }
                }, 1000);

                const timeToVote = setTimeout(async function() {
                    embedMessage.delete();

                    games_channel.send({ embed: passwordMessage });
                    if (client.config.custom_role_ping == true) {
                        await customRole
                            .setMentionable(true, 'Role needs to be pinged')
                            .catch(console.error);
                        await games_channel.send(
                            customRole + ' - the password is above!'
                        );
                        await customRole
                            .setMentionable(
                                false,
                                'Role no longer needs to be pinged'
                            )
                            .catch(console.error);
                    }
                    if (client.config.host_channel_messages === true) {
                        host_channel.send('Password has been posted!');
                    }
                }, timer * 60 * 1000);
            });
    }
    catch (error) {
        console.log(`${error}`);
    }
};
