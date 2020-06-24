const Discord = require('discord.js');
const config = require('../config.json');
const { client } = require('../index');
const emojiCharacters = require('../emojiCharacters.js');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    /**@type {Discord.TextChannel} */
    const host_channel = client.channels.cache.get(config.host_channel_id);
    /**@type {Discord.TextChannel} */
    const games_channel = client.channels.cache.get(config.games_channel_id);
    const customRole = message.guild.roles.cache.get(config.custom_role_id);
    let timerText = '';
    let timer = config.default_timer;

    if (args.length > 0) {
        timer = parseInt(args[0]);
        if (isNaN(timer)) {
            host_channel.send(new Discord.MessageEmbed()
                .setColor(0xff0000)
                .setTitle('Error!')
                .setDescription('Minutes is missing or not a number!')
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).catch(console.error);
            return;
        }
    }

    if (timer == 1) timerText = 'minute';
    else timerText = 'minutes';

    const gameTypeChoices = [`${emojiCharacters['WarMode']} for War Mode`, `${emojiCharacters['Conquest']} for War Mode Conquest`];

    if (timer == 0) {
        games_channel.send(new Discord.MessageEmbed()
            .setColor(0x3366ff)
            .setTitle('Random War Mode gametype selection')
            .setDescription('The War Mode gametype for the next game will be chosen randomly')
            .addField('Choices', gameTypeChoices.join('\n'), true)
            .addField('Selection', gameTypeChoices[Math.floor(Math.random() * Math.floor(gameTypeChoices.length))], true)
            .setTimestamp()
            .setFooter('', client.user.displayAvatarURL())
        ).catch(console.error);
        if (config.host_channel_messages === true)
            host_channel.send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('Random War Mode gametype selection')
                .setDescription('The War Mode gametype for the next game will be chosen randomly')
                .addField('Choices', gameTypeChoices.join('\n'), true)
                .addField('Selection', gameTypeChoices[Math.floor(Math.random() * Math.floor(gameTypeChoices.length))], true)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).catch(console.error);
    }
    else {
        try {
            await games_channel.send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('Vote for game type!')
                .setDescription('Please vote on the game type for the next game!')
                .addField('Choose a reaction', `${emojiCharacters['WarMode']} for War Mode
            ${emojiCharacters['Conquest']} for War Mode Conquest`)
                .addField('Vote will close in:', `${timer} ${timerText}`)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).then(async embedMessage => {
                /**@param {Discord.MessageReaction} reaction @param {Discord.User} user*/
                const filter = (reaction, user) => reaction.users.cache.has(client.user.id);
                const collector = embedMessage.createReactionCollector(filter);
                await embedMessage.react(emojiCharacters['WarMode']);
                await embedMessage.react(emojiCharacters['Conquest']);
                if (config.custom_role_ping == true) {
                    await customRole.setMentionable(true, 'Role needs to be pinged').catch(console.error);
                    await games_channel.send(`${customRole} - get voting!`).then(msg =>
                        setTimeout(function () {
                            msg.delete();
                        }, timer * 60 * 1000)
                    ).catch(console.error);
                    await customRole.setMentionable(false, 'Role no longer needs to be pinged').catch(console.error);
                }
                collector.on('end', reactions => {
                    let reactionID;
                    let maxCount = 0;
                    reactions.forEach(r => {
                        if (r.count > maxCount) {
                            maxCount = r.count;
                            reactionID = r.emoji.name;
                        }
                    });
                    let draws = [];
                    reactions.forEach(r => {
                        if (r.count == maxCount)
                            draws.push(r.emoji.name);
                    });
                    if (draws.length > 1)
                        reactionID = draws[Math.floor(Math.random() * Math.floor(draws.length))];
                    let winReact;

                    switch (reactionID) {
                        case emojiCharacters['WarMode']:
                            winReact = `${reactionID} for War Mode`;
                            break;
                        case emojiCharacters['Conquest']:
                            winReact = `${reactionID} for War Mode Conquest`;
                    }

                    let fields = [];

                    if (draws.length > 1)
                        fields = [
                            {
                                name: 'Draws',
                                value: `${draws.join(' ')}`,
                                inline: true
                            },
                            {
                                name: 'The winning game type is:',
                                value: `${winReact}`,
                                inline: true
                            }
                        ];
                    else
                        fields = [
                            {
                                name: 'The winning game type is:',
                                value: `${winReact}`,
                            }
                        ];

                    embedMessage.delete();
                    games_channel.send(new Discord.MessageEmbed()
                        .setColor(0x009900)
                        .setTitle('Vote for game type!')
                        .addFields(fields)
                        .setTimestamp()
                        .setFooter('', client.user.displayAvatarURL())
                    ).catch(console.error);
                    if (config.host_channel_messages === true)
                        host_channel.send(new Discord.MessageEmbed()
                            .setColor(0x009900)
                            .setTitle('Vote for game type!')
                            .addFields(fields)
                            .setTimestamp()
                            .setFooter('', client.user.displayAvatarURL())
                        ).catch(console.error);
                });
                const timeToVote = setTimeout(async function () {
                    collector.stop();
                }, timer * 60 * 1000);
                // Checks if message is deleted
                const checkIfDeleted = setInterval(function () {
                    if (embedMessage.deleted) {
                        clearTimeout(timeToVote);
                        clearInterval(checkIfDeleted);
                    }
                }, 1000);
            });
        }
        catch (error) {
            console.log(`${error}`);
        }
    }
}