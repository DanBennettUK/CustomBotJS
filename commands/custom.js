exports.run = async (client, message, args) => {
    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    const customRole = message.guild.roles.get(client.config.custom_role_id);
    const host_channel = client.channels.get(client.config.host_channel_id);
    const games_channel = client.channels.get(client.config.games_channel_id);

    await customRole.setMentionable(true, 'Role needs to be pinged').catch(console.error);
    await games_channel.send(`${customRole} ${args.join(' ')}`).catch(console.error);
    await customRole.setMentionable(false, 'Role no longer needs to be pinged').catch(console.error);

    host_channel.send({embed: {
        color: 0x3366ff,
        title: 'Message sent',
        description: `Message:\n${customRole} ${args.join(' ')}`,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
        }
    }}).catch(console.error);
}