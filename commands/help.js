exports.run = async (client, message) => {
    const configPrefix = client.config.prefix;

    if (
        !message.member.roles.some(
            role => role.id === client.config.host_role_id
        )
    ) {
        try {
            message.channel.send({
                embed: {
                    color: 0x666633,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL,
                        url: 'https://github.com/DanBennettUK/CustomBotJS',
                    },
                    title: 'Commands for users',
                    fields: [
                        {
                            name: `${configPrefix}help`,
                            value: 'lists all commands',
                        },
                        {
                            name: `${configPrefix}ping`,
                            value: 'checks Discord API response',
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: '© DanBennett',
                    },
                },
            });
        }
        catch (error) {
            console.log(`${error}`);
        }
    }
    else if (
        message.member.roles.some(
            role => role.id === client.config.host_role_id
        )
    ) {
        try {
            message.channel.send({
                embed: {
                    color: 0x666633,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL,
                        url: 'https://github.com/DanBennettUK/CustomBotJS',
                    },
                    title: 'Commands for hosts',
                    fields: [
                        {
                            name: `\`${configPrefix}help\``,
                            value: 'lists all commands',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}ping\``,
                            value: 'checks Discord API response',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}squadvote (sqv)\``,
                            value:
                                'Starts squadvote. \nUsage: `all` for 1-10 \nLeave blank for 1 2 4 8 \nChoose your own (e.g. `squadvote 3 4 6 8`)',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}perspectivevote (pv)\``,
                            value: 'Starts perspective vote.',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}regionvote (rv)\``,
                            value: 'Starts region vote',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}mapvote\``,
                            value: 'Starts map vote',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}clear\``,
                            value: `Clears bot messages from games channel \nUsage: \`all\` to remove all messages \nNumber of messages you want to delete \nExample: \`${configPrefix}clear 10\``,
                            inline: false,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: `© DanBennett - Version: ${
                            client.config.version
                        }`,
                    },
                },
            });
        }
        catch (error) {
            console.log(`${error}`);
        }
    }
};
