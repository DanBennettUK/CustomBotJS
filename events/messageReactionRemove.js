const Discord = require('discord.js');
const config = require('../config.json');

/**@param {Discord.MessageReaction} messageReaction @param {Discord.User} user*/
module.exports = (messageReaction, user) => {
    if (user.bot) return;
    if (messageReaction.message.id === config.role_message_id && messageReaction.emoji.name == config.role_reaction_emoji) {
        const guild = messageReaction.message.guild;
        guild.member(user.id).roles.remove(guild.roles.find(r => r.id === config.custom_role_id)).catch(console.error);
    }
}