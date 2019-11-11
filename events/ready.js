module.exports = (client) => {
    // On connect do these:
    const $ = client.$;
    setTimeout(() => {
        console.log(`${client.user.username} is ready for action!`);
        const roleChannel = client.channels.get(client.config.role_channel_id);
            if (client.config.role_message_id !== "") {
                roleChannel.fetchMessage(client.config.role_message_id).then(msg => msg.react(client.config.role_reaction_emoji)).catch(console.error);
            }

        $.ajax({
            dataType: 'json',
            url: `https://api.twitch.tv/helix/streams/?user_login=${
                client.config.activity.twitchUsername
            }`,
            headers: {
                'Client-ID': client.config.activity.twitch_client_id,
            },
            success: function(channel) {
                if (channel.data.length > 0) {
                    client.user.setActivity(channel.data[0].title, {
                        url: `https://twitch.tv/${client.config.activity.twitchUsername}`,
                    });
                }
                else {
                    client.user.setActivity(client.config.activity.message, {
                        type: 'WATCHING',
                        // PLAYING, LISTENING, WATCHING
                    });
                    client.user.setStatus(client.config.activity.status);
                    // dnd, idle, online, invisible
                }
            },
            error: function() {
                client.user.setActivity(client.config.activity.message, {
                    type: 'WATCHING',
                    // PLAYING, LISTENING, WATCHING
                });
                client.user.setStatus(client.config.activity.status);
                // dnd, idle, online, invisible
            },
        });

        setInterval(function() {
            $.ajax({
                dataType: 'json',
                url: `https://api.twitch.tv/helix/streams/?user_login=${
                    client.config.activity.twitchUsername
                }`,
                headers: {
                    'Client-ID': client.config.activity.twitch_client_id,
                },
                success: function(channel) {
                    if (channel.data.length > 0) {
                        client.user.setActivity(channel.data[0].title, {
                            url: `https://twitch.tv/${
                                client.config.activity.twitchUsername
                            }`,
                        });
                    }
                    else {
                        client.user.setActivity(client.config.activity.message, {
                            type: 'WATCHING',
                            // PLAYING, LISTENING, WATCHING
                        });
                        client.user.setStatus(client.config.activity.status);
                        // dnd, idle, online, invisible
                    }
                },
                error: function() {
                    client.user.setActivity(client.config.activity.message, {
                        type: 'WATCHING',
                        // PLAYING, LISTENING, WATCHING
                    });
                    client.user.setStatus(client.config.activity.status);
                    // dnd, idle, online, invisible
                },
            });
        }, 30000);
    }, 5000)
}
