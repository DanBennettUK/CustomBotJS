const config = require('../config.json');
const request = require('request');
const { client } = require('../index');

module.exports = () => {
    // On connect do these:
    setTimeout(() => {
        console.log(`${client.user.username} is ready for action!`);
        const roleChannel = client.channels.get(config.role_channel_id);
        if (config.role_message_id !== "") {
            roleChannel.fetchMessage(config.role_message_id).then(msg => msg.react(config.role_reaction_emoji)).catch(console.error);
        }

        //Won't work
        function checkTwitch() {
            request({
                url: `https://api.twitch.tv/helix/streams/?user_login=${config.activity.twitchUsername}`,
                headers: {
                    'Client-ID': config.activity.twitch_client_id
                }
            }, (error, response, body) => {
                if (!error) {
                    const channel = JSON.parse(body);
                    if (channel.data.length > 0) {
                        client.user.setActivity(channel.data[0].title, {
                            url: `https://twitch.tv/${config.activity.twitchUsername}`,
                        });
                    } else {
                        client.user.setActivity(config.activity.message, {
                            type: 'WATCHING',
                            // PLAYING, LISTENING, WATCHING
                        });
                        client.user.setStatus(config.activity.status);
                        // dnd, idle, online, invisible
                    }
                } else {
                    console.log(error);
                    client.user.setActivity(config.activity.message, {
                        type: 'WATCHING',
                        // PLAYING, LISTENING, WATCHING
                    });
                    client.user.setStatus(config.activity.status);
                    // dnd, idle, online, invisible
                }
            });
        }
        checkTwitch();
        setInterval(() => checkTwitch(), 30000);
    }, 5000)
}
