const Discord = require('discord.js');
const config = require('../config.json');
const https = require('https');
const { client } = require('../index');
let authToken = '';
let streamPresence = false;

module.exports = async () => {
    // On connect do these:
    console.log(`${client.user.username} is ready for action!`);
    /**@type {Discord.TextChannel} */
    client.user.setPresence({
        activity: {
            name: config.activity.message,
            type: 'WATCHING'
        }
    });
    const roleChannel = client.channels.cache.get(config.role_channel_id);
    if (config.role_message_id !== "")
        roleChannel.messages.fetch(config.role_message_id).then(msg => msg.react(config.role_reaction_emoji)).catch(console.error);

    checkTwitch();
    setInterval(() => checkTwitch(), 30000);
}

/**@function getToken
 * This function fetches an authentication token from twitch, if one is not present
 * @param {Function} callback The function to be executed after the token is fetched
 */
function getToken(callback) {
    const authReq = https.request({
        hostname: 'id.twitch.tv',
        port: 443,
        path: `/oauth2/token?client_id=${config.activity.twitch_client_id}&client_secret=${config.activity.twitch_client_secret}&grant_type=client_credentials`,
        method: "POST"
    }, (res) => {
        res.setEncoding('utf8');
        res.on('data', async d => {
            let data = JSON.parse(d);
            authToken = data.access_token;
            callback();
        });
    });
    authReq.end();
}

/**@function checkTwitch
 * This function checks if the specified twitch channel is active and adjusts presence accordingly  
 * If there is no authorization token, it calls the getToken function
 * @see getToken
 */
function checkTwitch() {
    const req = https.get({
        host: 'api.twitch.tv',
        path: `/helix/streams/?user_login=${config.activity.twitchUsername}`,
        headers: {
            'Client-ID': `${config.activity.twitch_client_id}`,
            'Authorization': `Bearer ${authToken}`
        }
    }, res => {
        if (res.statusCode === 401)
            getToken(() => checkTwitch());
        else {
            res.on('error', e => console.error(e));
            res.on('data', d => {
                let channel = null;
                try {
                    channel = JSON.parse(d);
                } catch (e) {
                    channel = null;
                }
                if (channel != null && channel && channel.data && channel.data.length > 0) {
                    if (streamPresence === false) {
                        client.user.setPresence({
                            activity: {
                                name: channel.data[0].title,
                                url: `https://twitch.tv/${config.activity.twitchUsername}`,
                                type: 'STREAMING'
                            }
                        });
                        streamPresence = true;
                    }
                }
                else if (streamPresence === true) {
                    client.user.setPresence({
                        activity: {
                            name: config.activity.message,
                            type: 'WATCHING'
                        },
                        status: config.activity.status
                    });
                    streamPresence = false;
                }
            });
        }
    });
    req.end();
}