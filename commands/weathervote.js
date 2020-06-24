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

    // Get customRole for pinging later
    const customRole = message.guild.roles.cache.get(config.custom_role_id);

    /**@type {Discord.TextChannel} */
    const host_channel = client.channels.cache.get(config.host_channel_id);
    /**@type {Discord.TextChannel} */
    const games_channel = client.channels.cache.get(config.games_channel_id);
    let timer = config.default_timer;
    let timerText;
    let weatherChoices = [];

    args.forEach(function (arg, i) {
        args[i] = arg.toLowerCase();
    });

    if (args.length > 0) {
        if (parseInt(args[args.length - 1]) || args[args.length - 1] == 0) {
            timer = parseInt(args[args.length - 1]);
            args.splice(args.length - 1, 1);
        }
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

    if (timer == 1)
        timerText = 'minute';
    else
        timerText = 'minutes';

    if (args.length > 0) {
        if (!['all', 'erangel', 'miramar', 'sanhok', 'vikendi'].includes(args[0])) {
            if (args.some(weather => weather.includes('sunny')))
                weatherChoices.push(`${emojiCharacters['Sunny']} for Sunny`);
            if (args.some(weather => weather.includes('rainy')))
                weatherChoices.push(`${emojiCharacters['Rainy']} for Rainy`);
            if (args.some(weather => weather.includes('clear')))
                weatherChoices.push(`${emojiCharacters['Clear']} for Sunny Clear`);
            if (args.some(weather => weather.includes('sunset')))
                weatherChoices.push(`${emojiCharacters['Sunset']} for Sunset`);
            if (args.some(weather => weather.includes('foggy')))
                weatherChoices.push(`${emojiCharacters['Foggy']} for Foggy`);
            if (args.some(weather => weather.includes('overcast')))
                weatherChoices.push(`${emojiCharacters['Overcast']} for Overcast`);
            if (args.some(weather => weather.includes('sunrise')))
                weatherChoices.push(`${emojiCharacters['Sunrise']} for Sunrise`);
            if (args.some(weather => weather.includes('snowy')))
                weatherChoices.push(`${emojiCharacters['Snowy']} for Snowy`);
            if (args.some(weather => weather.includes('moonlight')))
                weatherChoices.push(`${emojiCharacters['Moonlight']} for Moonlight`);
        }
        else if (args[0] === 'erangel') {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Rainy']} for Rainy`,
                `${emojiCharacters['Clear']} for Sunny Clear`,
                `${emojiCharacters['Sunset']} for Sunset`,
                `${emojiCharacters['Foggy']} for Foggy`,
                `${emojiCharacters['Overcast']} for Overcast`
            ];
        }
        else if (args[0] === 'miramar') {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Sunrise']} for Sunrise`,
                `${emojiCharacters['Sunset']} for Sunset`,
                `${emojiCharacters['Rainy']} for Rainy`,
                `${emojiCharacters['Foggy']} for Foggy`,
                `${emojiCharacters['Overcast']} for Overcast`
            ];
        }
        else if (args[0] === 'sanhok') {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Rainy']} for Rainy`,
                `${emojiCharacters['Foggy']} for Foggy`,
                `${emojiCharacters['Overcast']} for Overcast`
            ];
        }
        else if (args[0] === 'vikendi') {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Moonlight']} for Moonlight`,
                `${emojiCharacters['Snowy']} for Snowy`
            ];
        }
        else {
            weatherChoices = [
                `${emojiCharacters['Sunny']} for Sunny`,
                `${emojiCharacters['Rainy']} for Rainy`,
                `${emojiCharacters['Clear']} for Sunny Clear`,
                `${emojiCharacters['Sunset']} for Sunset`,
                `${emojiCharacters['Foggy']} for Foggy`,
                `${emojiCharacters['Overcast']} for Overcast`,
                `${emojiCharacters['Sunrise']} for Sunrise`,
                `${emojiCharacters['Moonlight']} for Moonlight`,
                `${emojiCharacters['Snowy']} for Snowy`
            ];
        }
    } else {
        weatherChoices = [
            `${emojiCharacters['Sunny']} for Sunny`,
            `${emojiCharacters['Rainy']} for Rainy`,
            `${emojiCharacters['Clear']} for Sunny Clear`,
            `${emojiCharacters['Sunset']} for Sunset`,
            `${emojiCharacters['Foggy']} for Foggy`,
            `${emojiCharacters['Overcast']} for Overcast`,
            `${emojiCharacters['Sunrise']} for Sunrise`,
            `${emojiCharacters['Moonlight']} for Moonlight`,
            `${emojiCharacters['Snowy']} for Snowy`
        ];
    }

    if (timer == 0) {
        games_channel.send(new Discord.MessageEmbed()
            .setColor(0x3366ff)
            .setTitle('Random weather selection')
            .setDescription('The weather for the next game will be randomly selected from the choices provided')
            .addField('Choices', weatherChoices.join('\n'))
            .addField('Selection', weatherChoices[Math.floor(Math.random() * Math.floor(weatherChoices.length))], true)
            .setTimestamp()
            .setFooter('', client.user.displayAvatarURL())
        ).catch(console.error);
        if (config.host_channel_messages === true)
            host_channel.send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('Random weather selection')
                .setDescription('The weather for the next game will be randomly selected from the choices provided')
                .addField('Choices', weatherChoices.join('\n'))
                .addField('Selection', weatherChoices[Math.floor(Math.random() * Math.floor(weatherChoices.length))], true)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).catch(console.error);
    }
    else {
        try {
            await games_channel.send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('Vote for weather!')
                .setDescription('Please vote on the weather for the next game!')
                .addField('Choose a reaction', weatherChoices.join('\n'))
                .addField('Vote will close in:', `${timer} ${timerText}`)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).then(async embedMessage => {
                /**@param {Discord.MessageReaction} reaction @param {Discord.User} user*/
                const filter = (reaction, user) => reaction.users.cache.has(client.user.id);
                const collector = embedMessage.createReactionCollector(filter);
                if (args.length > 0) {
                    if (!['all', 'erangel', 'miramar', 'sanhok', 'vikendi'].includes(args[0])) {
                        if (args.some(weather => weather.includes('sunny')))
                            await embedMessage.react(emojiCharacters['Sunny']);
                        if (args.some(weather => weather.includes('rainy')))
                            await embedMessage.react(emojiCharacters['Rainy']);
                        if (args.some(weather => weather.includes('clear')))
                            await embedMessage.react(emojiCharacters['Clear']);
                        if (args.some(weather => weather.includes('sunset')))
                            await embedMessage.react(emojiCharacters['Sunset']);
                        if (args.some(weather => weather.includes('foggy')))
                            await embedMessage.react(emojiCharacters['Foggy']);
                        if (args.some(weather => weather.includes('overcast')))
                            await embedMessage.react(emojiCharacters['Overcast']);
                        if (args.some(weather => weather.includes('sunrise')))
                            await embedMessage.react(emojiCharacters['Sunrise']);
                        if (args.some(weather => weather.includes('moonlight')))
                            await embedMessage.react(emojiCharacters['Moonlight']);
                        if (args.some(weather => weather.includes('snowy')))
                            await embedMessage.react(emojiCharacters['Snowy']);
                    }
                    else if (args[0] === 'erangel') {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Rainy']);
                        await embedMessage.react(emojiCharacters['Clear']);
                        await embedMessage.react(emojiCharacters['Sunset']);
                        await embedMessage.react(emojiCharacters['Foggy']);
                        await embedMessage.react(emojiCharacters['Overcast']);
                    }
                    else if (args[0] === 'miramar') {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Sunrise']);
                        await embedMessage.react(emojiCharacters['Sunset']);
                        await embedMessage.react(emojiCharacters['Rainy']);
                        await embedMessage.react(emojiCharacters['Foggy']);
                        await embedMessage.react(emojiCharacters['Overcast']);
                    }
                    else if (args[0] === 'sanhok') {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Rainy']);
                        await embedMessage.react(emojiCharacters['Foggy']);
                        await embedMessage.react(emojiCharacters['Overcast']);
                    }
                    else if (args[0] === 'vikendi') {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Moonlight']);
                        await embedMessage.react(emojiCharacters['Snowy']);
                    }
                    else {
                        await embedMessage.react(emojiCharacters['Sunny']);
                        await embedMessage.react(emojiCharacters['Rainy']);
                        await embedMessage.react(emojiCharacters['Clear']);
                        await embedMessage.react(emojiCharacters['Sunset']);
                        await embedMessage.react(emojiCharacters['Foggy']);
                        await embedMessage.react(emojiCharacters['Overcast']);
                        await embedMessage.react(emojiCharacters['Sunrise']);
                        await embedMessage.react(emojiCharacters['Moonlight']);
                        await embedMessage.react(emojiCharacters['Snowy']);
                    }
                } else {
                    await embedMessage.react(emojiCharacters['Sunny']);
                    await embedMessage.react(emojiCharacters['Rainy']);
                    await embedMessage.react(emojiCharacters['Clear']);
                    await embedMessage.react(emojiCharacters['Sunset']);
                    await embedMessage.react(emojiCharacters['Foggy']);
                    await embedMessage.react(emojiCharacters['Overcast']);
                    await embedMessage.react(emojiCharacters['Sunrise']);
                    await embedMessage.react(emojiCharacters['Moonlight']);
                    await embedMessage.react(emojiCharacters['Snowy']);
                }
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
                    if (draws.length > 1) {
                        reactionID = draws[Math.floor(Math.random() * Math.floor(draws.length))];
                    }
                    let winReact;

                    switch (reactionID) {
                        case emojiCharacters['Sunny']:
                            winReact = `${reactionID} for Sunny`;
                            break;
                        case emojiCharacters['Rainy']:
                            winReact = `${reactionID} for Rainy`;
                            break;
                        case emojiCharacters['Clear']:
                            winReact = `${reactionID} for Sunny Clear`;
                            break;
                        case emojiCharacters['Sunset']:
                            winReact = `${reactionID} for Sunset`;
                            break;
                        case emojiCharacters['Foggy']:
                            winReact = `${reactionID} for Foggy`;
                            break;
                        case emojiCharacters['Overcast']:
                            winReact = `${reactionID} for Overcast`;
                            break;
                        case emojiCharacters['Sunrise']:
                            winReact = `${reactionID} for Sunrise`;
                            break;
                        case emojiCharacters['Snowy']:
                            winReact = `${reactionID} for Snowy`;
                            break;
                        case emojiCharacters['Moonlight']:
                            winReact = `${reactionID} for Moonlight`;
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
                                name: 'The winning weather is:',
                                value: `${winReact}`,
                                inline: true
                            }
                        ];
                    else
                        fields = [
                            {
                                name: 'The winning weather is:',
                                value: `${winReact}`,
                            }
                        ];

                    embedMessage.delete();
                    games_channel.send(new Discord.MessageEmbed()
                        .setColor(0x009900)
                        .setTitle('Vote for weather!')
                        .addFields(fields)
                        .setTimestamp()
                        .setFooter('', client.user.displayAvatarURL())
                    ).catch(console.error);
                    if (config.host_channel_messages === true)
                        host_channel.send(new Discord.MessageEmbed()
                            .setColor(0x009900)
                            .setTitle('Vote for weather!')
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
        } catch (error) {
            console.log(`${error}`);
        }
    }
}