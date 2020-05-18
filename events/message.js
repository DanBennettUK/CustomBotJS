const Discord = require('discord.js');
const { client } = require('../index');
const config = require('../config.json');
const fs = require('fs');

/**@param {Discord.Message} message*/
module.exports = (message) => {
    // Ignore all bots
    if (message.author.bot) return;

    if (message.channel.type !== ('dm' || 'group')) {
        // If the message is a DM or GroupDM, return.

        // Ignore messages not starting with the prefix (in config.json)
        if (message.content.indexOf(config.prefix) !== 0) return;
        // Our standard argument/command name definition.
        let args = message.content
            .slice(config.prefix.length)
            .trim()
            .split(/ +/g);

        let command = args.shift().toLowerCase();

        // Command aliases
        if (command === 'sqv') command = 'squadvote';
        if (command === 'rv') command = 'regionvote';
        if (command === 'pv') command = 'perspectivevote';
        if (command === 'mv') command = 'mapvote';
        if (command === 'pw') command = 'password';
        if (command === 'wmwv') command = 'warmodeweaponsvote';
        if (command === 'setvoicelimit') command = 'vclimit';
        if (command === 'wmgv') command = 'warmodegametypevote';
        if (command === 'wv') command = 'weathervote';

        fs.readdir('./commands', (err, files) => {
            if (err) throw err;
            if (files.some(file => file.split('.')[0] === command))
                require(`../commands/${command}`)(message, args);
        });

    } else {
        const directMessageEmbed = {
            color: 0x3366ff,
            title: `Info`,
            description: config.directMessage.join(`\n`),
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
            }
        };
        message.channel.send({ embed: directMessageEmbed });
    }
};
