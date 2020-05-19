const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const client = new Discord.Client();

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        console.log(`Attempting to load event ${eventName}`);
        client.on(eventName, event.bind());
    });
});


fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const commandName = file.split('.')[0];
        console.log(`Attempting to load command ${commandName}`);
    });
});

// Current bot version
client.version = '1.2';

// Debug errors
if (config.debug_enable === true) {
    client.on('error', e => console.error(e));
    client.on('warn', e => console.warn(e));
    client.on('debug', e => console.info(e));
}
client.login(config.token);

exports.client = client;