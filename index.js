const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const config = require('./config.json');
const client = new Discord.Client();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM('').window;
global.document = document;

const $ = require('jquery')(window);
client.commands = new Discord.Collection();

// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        console.log(`Attempting to load event ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Enmap();

fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const props = require(`./commands/${file}`);
        const commandName = file.split('.')[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

// On connect do these:
client.on('ready', () => {
    console.log(`${client.user.username} is ready for action!`);

    $.ajax({
        dataType: 'json',
        url: `https://api.twitch.tv/helix/streams/?user_login=${
            config.activity.twitchUsername
        }`,
        headers: {
            'Client-ID': config.activity.twitch_client_id,
        },
        success: function(channel) {
            if (channel.data.length > 0) {
                client.user.setActivity(channel.data[0].title, {
                    url: `https://twitch.tv/${config.activity.twitchUsername}`,
                });
            }
            else {
                client.user.setActivity(config.activity.message, {
                    type: 'WATCHING',
                    // PLAYING, LISTENING, WATCHING
                });
                client.user.setStatus(config.activity.status);
                // dnd, idle, online, invisible
            }
        },
        error: function() {
            client.user.setActivity(config.activity.message, {
                type: 'WATCHING',
                // PLAYING, LISTENING, WATCHING
            });
            client.user.setStatus(config.activity.status);
            // dnd, idle, online, invisible
        },
    });

    setInterval(function() {
        $.ajax({
            dataType: 'json',
            url: `https://api.twitch.tv/helix/streams/?user_login=${
                config.activity.twitchUsername
            }`,
            headers: {
                'Client-ID': config.activity.twitch_client_id,
            },
            success: function(channel) {
                if (channel.data.length > 0) {
                    client.user.setActivity(channel.data[0].title, {
                        url: `https://twitch.tv/${
                            config.activity.twitchUsername
                        }`,
                    });
                }
                else {
                    client.user.setActivity(config.activity.message, {
                        type: 'WATCHING',
                        // PLAYING, LISTENING, WATCHING
                    });
                    client.user.setStatus(config.activity.status);
                    // dnd, idle, online, invisible
                }
            },
            error: function() {
                client.user.setActivity(config.activity.message, {
                    type: 'WATCHING',
                    // PLAYING, LISTENING, WATCHING
                });
                client.user.setStatus(config.activity.status);
                // dnd, idle, online, invisible
            },
        });
    }, 30000);
});

client.on('raw', async event => {
    const eventName = event.t;
    if (eventName === 'MESSAGE_REACTION_ADD') {
        if (event.d.message_id === config.role_message_id) {
            const reactionChannel = client.channels.get(event.d.channel_id);
            if (reactionChannel.messages.has(event.d.message_id)) {
                return;
            }
            else {
                reactionChannel
                    .fetchMessage(event.d.message_id)
                    .then(msg => {
                        const msgReaction = msg.reactions.get(
                            event.d.emoji.name
                        );
                        const user = client.users.get(event.d.user_id);
                        client.emit('messageReactionAdd', msgReaction, user);
                    })
                    .catch(err => console.log(err));
            }
        }
    }
    else if (eventName === 'MESSAGE_REACTION_REMOVE') {
        if (event.d.message_id === config.role_message_id) {
            const reactionChannel = client.channels.get(event.d.channel_id);
            if (reactionChannel.messages.has(event.d.message_id)) {
                return;
            }
            else {
                reactionChannel
                    .fetchMessage(event.d.message_id)
                    .then(msg => {
                        const msgReaction = msg.reactions.get(
                            event.d.emoji.name
                        );
                        const user = client.users.get(event.d.user_id);
                        client.emit('messageReactionRemove', msgReaction, user);
                    })
                    .catch(err => console.log(err));
            }
        }
    }
});
client.on('messageReactionAdd', (messageReaction, user) => {
    if (messageReaction.message.id === config.role_message_id) {
        const roleID = config.custom_role_id;
        const role = messageReaction.message.guild.roles.find(
            role => role.id === roleID
        );
        if (role) {
            const member = messageReaction.message.guild.members.find(
                member => member.id === user.id
            );
            if (member) {
                member.addRole(role.id);
            }
        }
    }
});
client.on('messageReactionRemove', (messageReaction, user) => {
    if (messageReaction.message.id === config.role_message_id) {
        const roleID = config.custom_role_id;
        const role = messageReaction.message.guild.roles.find(
            role => role.id === roleID
        );
        if (role) {
            const member = messageReaction.message.guild.members.find(
                member => member.id === user.id
            );
            if (member) {
                member.removeRole(role.id);
            }
        }
    }
});

// Current bot version
client.version = '1.0.4';

// Debug errors
if (config.debug_enable === true) {
    client.on('error', e => console.error(e));
    client.on('warn', e => console.warn(e));
    client.on('debug', e => console.info(e));
}
client.login(config.token);
