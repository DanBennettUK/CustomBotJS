const Discord = require('discord.js');
const config = require('../config.json');
const { client } = require('../index');

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
    /**@type {Discord.TextChannel} */
    const subscriber_channel = client.channels.cache.get(config.subscriber_channel_id);

    let serverPassword = args[0];
    let timer = config.default_timer;
    let serverName = args[2];
    let timerText = '';

    if (args[1]) {
        if (typeof timer == 'number')
            timer = parseInt(args[1]);
        else {
            sendError(host_channel, 'Minutes is missing or not a number!');
            return;
        }
    }

    if (typeof serverPassword === 'undefined') {
        if (config.default_game_server_password !== '')
            serverPassword = config.default_game_server_password;
        else {
            sendError(host_channel, 'Password is missing!');
            return;
        }
    }
    if (typeof serverName === 'undefined') {
        if (config.default_game_server_name !== '')
            serverName = config.default_game_server_name;
        else {
            sendError(host_channel, 'Server Name is missing!');
            return;
        }
    }

    if (timer == 1)
        timerText = 'minute';
    else
        timerText = 'minutes';

    const passwordMessage = new Discord.MessageEmbed()
        .setColor(0x009900)
        .setTitle('Custom Game Server Details')
        .addField('Server Name:', `${serverName}`)
        .addField('Password:', `${serverPassword}`)
        .setTimestamp()
        .setFooter('', client.user.displayAvatarURL());

    if (timer == 0) {
        if (subscriber_channel != '') {
            await subscriber_channel.send(passwordMessage).catch(console.error);
            await customRole.setMentionable(true, 'Role needs to be pinged').catch(console.error);
            await subscriber_channel.send(`${customRole} - the password is above!`).catch(console.error);
            await customRole.setMentionable(false, 'Role no longer needs to be pinged').catch(console.error);
        }
        await games_channel.send(passwordMessage).catch(console.error);
        await customRole.setMentionable(true, 'Role needs to be pinged').catch(console.error);
        await games_channel.send(`${customRole} - the password is above!`).catch(console.error);
        await customRole.setMentionable(false, 'Role no longer needs to be pinged').catch(console.error);
        if (config.host_channel_messages === true)
            host_channel.send('Password has been posted!').catch(console.error);
    }
    else {
        try {
            if (subscriber_channel != '') {
                await subscriber_channel.send(passwordMessage);
                await customRole.setMentionable(true, 'Role needs to be pinged').catch(console.error);
                await subscriber_channel.send(`${customRole} - the password is above!`).catch(console.error);
                await customRole.setMentionable(false, 'Role no longer needs to be pinged').catch(console.error);
            }
            await games_channel.send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('Custom Game Server Details')
                .addField('The password will be posted in:', `${timer} ${timerText}`)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).then(async embedMessage => {
                const timeToVote = setTimeout(async function () {
                    embedMessage.delete();
                    games_channel.send(passwordMessage).catch(console.error);
                    if (config.custom_role_ping == true) {
                        await customRole.setMentionable(true, 'Role needs to be pinged').catch(console.error);
                        await games_channel.send(`${customRole} - the password is above!`).catch(console.error);
                        await customRole.setMentionable(false, 'Role no longer needs to be pinged').catch(console.error);
                    }
                    if (config.host_channel_messages === true)
                        host_channel.send('Password has been posted!').catch(console.error);
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
};

/**@function sendError
 * This function sends an error as it occurs and terminates the command,
 * @param {Discord.TextChannel} channel The channel where the error is sent
 * @param {String} error The error to send
 */
function sendError(channel, error) {
    channel.send(new Discord.MessageEmbed()
        .setColor(0xff0000)
        .setTitle('Error!')
        .addField('One or more of your arguments are wrong',
            `Ensure you follow the correct format:
            <password> [minutes] [servername]
            Options in []\'s are only optional if a default is set`)
        .addField('Error:', error)
        .setTimestamp()
        .setFooter('', client.user.displayAvatarURL())
    ).catch(console.error);
}