const Discord = require('discord.js');
const { client } = require('../index');
const config = require('../config.json');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    if (!message.member.roles.cache.some(role => role.id === config.host_role_id)) {
        try {
            message.channel.send(new Discord.MessageEmbed()
                .setColor(0x666633)
                .setAuthor(client.user.username, client.user.displayAvatarURL(),
                    'https://github.com/DanBennettUK/CustomBotJS')
                .setTitle('Commands for users')
                .addField(`${config.prefix}help`, 'lists all commands')
                .addField(`${config.prefix}ping`, 'checks Discord API response')
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())).catch(console.error)
        }
        catch (error) {
            console.log(`${error}`);
        }
    }
    else {
        try {
            message.channel.send(new Discord.MessageEmbed()
                .setColor(0x666633)
                .setAuthor(client.user.username, client.user.displayAvatarURL(),
                    'https://github.com/DanBennettUK/CustomBotJS')
                .setTitle('Commands for hosts')
                .addField(`${config.prefix}help`, 'lists all commands')
                .addField(`${config.prefix}ping`, 'checks Discord API response')
                .addField(`${config.prefix}squadvote (sqv) <sizes> [-minutes]`,
                    `Starts squadvote.
                    Usage:
                        \`all\` for 1-10
                        Leave blank for 1 2 4 8
                        Choose your own (e.g. \`squadvote 3 4 6 8\`)
                    For an optional custom timer, use \`-[minutes]\` at the end.`)
                .addField(`${config.prefix}perspectivevote (pv) [minutes]`,
                    'Starts perspective vote. [minutes] is optional')
                .addField(`${config.prefix}regionvote (rv) [minutes]`,
                    'Starts region vote. [minutes] is optional')
                .addField(`${config.prefix}mapvote (mv) [warmode (wm)] <maps> [minutes]`,
                    `Starts map vote.
                Usage:
                    Leave blank or \`all\` for all maps
                    Choose your own maps (e.g. \`mapvote erangel miramar\`)
                    use [warmode] to add Camp Jackal to the map pool
                [minutes] is optional.`)
                .addField(`${config.prefix}weathervote (wv) [map] [minutes]`,
                    `Starts weather vote.
                Usage:
                    Leave blank or \`all\` for all weather
                    Enter a map for all weather available to the map
                    Choose your own (e.g. \`weathervote sunny rainy foggy\`)
                [minutes] is optional.`)
                .addField(`${config.prefix}warmodeweaponsvote (wmwv) [minutes]`,
                    'Starts warmode weapons vote. [minutes] is optional')
                .addField(`${config.prefix}warmodegametypevote (wmgv) [minutes]`,
                    'Starts warmode weapons vote. [minutes] is optional.')
                .addField(`${config.prefix}startgame [minutes]`,
                    'Starts a countdown for the game to start. [minutes] is optional.')
                .addField(`${config.prefix}countdown [minutes]`,
                    'Starts a countdown. [minutes] is optional')
                .addField(`${config.prefix}vclimit <limit>`,
                    `Sets voice channels starting with ${config.voice_channel_emoji} to <limit>`)
                .addField(`${config.prefix}clear`,
                    `Clears bot messages from games channel
                    Usage:
                        \`all\` to remove all messages
                        Number of messages you want to delete
                    Example: \`${config.prefix}clear 10\``)
                .addField(`${config.prefix}custom [message]`,
                    `Clears bot messages from games channel
                    Usage:
                        \`all\` to remove all messages
                        Number of messages you want to delete
                    Example: \`${config.prefix}clear 10\``)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).catch(console.error);
        }
        catch (error) {
            console.log(`${error}`);
        }
    }
};
