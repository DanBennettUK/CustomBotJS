const Discord = require('discord.js');
const config = require('../config.json');
const { client } = require('../index');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    // Get customRole for pinging later
    const customRole = message.guild.roles.get(config.custom_role_id);
    const subscriberRole = message.guild.roles.get(
        config.subscriber_role_id
    );
    const host_channel = client.channels.get(config.host_channel_id);
    const games_channel = client.channels.get(config.games_channel_id);
    const subscriber_channel = client.channels.get(
        config.subscriber_channel_id
    );
    const title = 'Custom Game Server Details';

    let serverPassword = args[0];
    let timer = config.default_timer;
    let serverName = args[2];
    let raiseError = false;
    let timeLeft;
    let timerText;
    let missingText = '';

    if (args[1]) {
        timer = parseInt(args[1]);
        if (isNaN(timer)) {
            raiseError = true;
            missingText = missingText + 'Minutes is missing or not a number!\n';
        }
    }

    if (typeof serverPassword === 'undefined') {
        if (config.default_game_server_password !== '') {
            serverPassword = config.default_game_server_password;
        }
        else {
            raiseError = true;
            missingText = missingText + 'Password is missing!\n';
        }
    }
    if (typeof serverName === 'undefined') {
        if (config.default_game_server_name !== '') {
            serverName = config.default_game_server_name;
        }
        else {
            raiseError = true;
            missingText = missingText + 'Server Name is missing!\n';
        }
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

    if (timer == 1) {
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
    if (timer == 0) {
        if (subscriber_channel != '') {
            await subscriber_channel.send({
                embed: passwordMessage,
            }).catch(console.error);
            await customRole
                .setMentionable(true, 'Role needs to be pinged')
                .catch(console.error);
            await subscriber_channel.send(
                customRole + ' - the password is above!'
            );
            await customRole
                .setMentionable(false, 'Role no longer needs to be pinged')
                .catch(console.error);
        }
        await games_channel.send({
            embed: passwordMessage,
        }).catch(console.error);
        await customRole
            .setMentionable(true, 'Role needs to be pinged')
            .catch(console.error);
        await games_channel.send(
            customRole + ' - the password is above!'
        );
        await customRole
            .setMentionable(false, 'Role no longer needs to be pinged')
            .catch(console.error);
        if (config.host_channel_messages === true) {
            host_channel.send('Password has been posted!');
        }
    }
    else {
        try {
            if (subscriber_channel != '') {
                await subscriber_channel.send({
                    embed: passwordMessage,
                });
                await customRole
                    .setMentionable(true, 'Role needs to be pinged')
                    .catch(console.error);
                await subscriber_channel.send(
                    customRole + ' - the password is above!'
                );
                await customRole
                    .setMentionable(false, 'Role no longer needs to be pinged')
                    .catch(console.error);
            }
            await games_channel
                .send({ embed: prePasswordMessage })
                .then(async embedMessage => {
                    const timeToVote = setTimeout(async function () {
                        embedMessage.delete();

                        games_channel.send({ embed: passwordMessage });
                        if (config.custom_role_ping == true) {
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
                        if (config.host_channel_messages === true) {
                            host_channel.send('Password has been posted!');
                        }
                    }, timer * 60 * 1000);
                    // Checks if message is deleted
                    const checkIfDeleted = setInterval(function () {
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
};
