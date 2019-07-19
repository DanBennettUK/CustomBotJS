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
                            name: `\`${configPrefix}squadvote (sqv) <sizes>\``,
                            value:
                                'Starts squadvote. \nUsage: `all` for 1-10 \nLeave blank for 1 2 4 8 \nChoose your own (e.g. `squadvote 3 4 6 8`)',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}perspectivevote (pv) [minutes]\``,
                            value:
                                'Starts perspective vote. [minutes] is optional.',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}regionvote (rv) [minutes]\``,
                            value: 'Starts region vote. [minutes] is optional.',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}mapvote (mv) [minutes]\``,
                            value: 'Starts map vote. [minutes] is optional.',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}warmodeweaponsvote (wmwv/wmv) [minutes]\``,
                            value:
                                'Starts warmode weapons vote. [minutes] is optional.',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}warmodegametypevote (wmgv/wmg) [minutes]\``,
                            value:
                                'Starts warmode game type vote. [minutes] is optional.',
                            inline: false
                        },
                        {
                            name: `\`${configPrefix}startgame [minutes]\``,
                            value:
                                'Starts a countdown for the game to start. [minutes] is optional.',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}countdown [minutes]\``,
                            value: 'Starts a countdown. [minutes] is optional.',
                            inline: false,
                        },
                        {
                            name: `\`${configPrefix}vclimit <limit>\``,
                            value: `Sets voice channels starting with ${
                                client.config.voice_channel_emoji
                            } to <limit>`,
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
                        text: `© DanBennett - Version: ${client.version}`,
                    },
                },
            });
        }
        catch (error) {
            console.log(`${error}`);
        }
    }
};
