module.exports = (client) => {
    // On connect do these:
    const request = client.request;
    setTimeout(() => {
        console.log(`${client.user.username} is ready for action!`);
        const roleChannel = client.channels.get(client.config.role_channel_id);
        roleChannel.fetchMessage(client.config.role_message_id).then(msg => msg.react(client.config.role_reaction_emoji)).catch(console.error);

        function checkTwitch() {
            request({
                url: `https://api.twitch.tv/helix/streams/?user_login=${client.config.activity.twitchUsername}`,
                headers: {
                    'Client-ID': client.config.activity.twitch_client_id
                }
            }, (error, response, body) => {
                if (!error) {
                    const channel = JSON.parse(body);
                    if (channel.data.length > 0) {
                        client.user.setActivity(channel.data[0].title, {
                            url: `https://twitch.tv/${client.config.activity.twitchUsername}`,
                        });
                    } else {
                        client.user.setActivity(client.config.activity.message, {
                            type: 'WATCHING',
                            // PLAYING, LISTENING, WATCHING
                        });
                        client.user.setStatus(client.config.activity.status);
                        // dnd, idle, online, invisible
                    }
                } else {
                    console.log(error);
                    client.user.setActivity(client.config.activity.message, {
                        type: 'WATCHING',
                        // PLAYING, LISTENING, WATCHING
                    });
                    client.user.setStatus(client.config.activity.status);
                    // dnd, idle, online, invisible
                }
            });
        }
        checkTwitch();
        setInterval(() => checkTwitch(), 30000);
    }, 5000)
}