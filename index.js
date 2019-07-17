const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const config = require('./config.json');
const client = new Discord.Client();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

const $ = jQuery = require('jquery')(window);
client.commands = new Discord.Collection();

// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];
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

    client.user.setActivity(`See #custom-games-info for info`, {
        type: 'WATCHING',
        // PLAYING, LISTENING, WATCHING
    });
    client.user.setStatus('dnd');
    // dnd, idle, online, invisible

    setInterval(function () {
        $.ajax({ 
            dataType:'json',
            url:`https://api.twitch.tv/helix/streams/?user_login=${config.activity.twitchUsername}`,
            headers: {
                'Client-ID': config.activity.twitch_client_id
              },
            success:function(channel) { 
                if (channel.data[0].type === `live`) {
                    client.user.setActivity(channel.data[0].title, {
                        url: `https://twitch.tv/${config.activity.twitchUsername}`,
                    })
                } else {
                    client.user.setActivity(`See #custom-games-info for info`, {
                        type: 'WATCHING',
                        // PLAYING, LISTENING, WATCHING
                    });
                    client.user.setStatus('dnd');
                    // dnd, idle, online, invisible
                }
            },
            error:function() {
                client.user.setActivity(`See #custom-games-info for info`, {
                    type: 'WATCHING',
                    // PLAYING, LISTENING, WATCHING
                });
                client.user.setStatus('dnd');
                // dnd, idle, online, invisible
            }
        });
    }, 30000);
});

// Debug errors
if (config.debug_enable === true) {
    client.on('error', e => console.error(e));
    client.on('warn', e => console.warn(e));
    client.on('debug', e => console.info(e));
}
client.login(config.token);
