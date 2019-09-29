module.exports = (client, messageReaction, user) => {
    if (user.bot) return;
    if (messageReaction.message.id === client.config.role_message_id && messageReaction.emoji.name == client.config.role_reaction_emoji) {
        const guild = messageReaction.message.guild;
        guild.member(user.id).addRole(guild.roles.find(r => r.id === client.config.custom_role_id)).catch(console.error);
    }
}