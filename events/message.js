module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    if (message.channel.type !== ('dm' || 'group')) {
        // If the message is a DM or GroupDM, return.

        // Ignore messages not starting with the prefix (in config.json)
        if (message.content.indexOf(client.config.prefix) !== 0) return;
        // Our standard argument/command name definition.
        let args = message.content
            .slice(client.config.prefix.length)
            .trim()
            .split(/ +/g);

        let command = args.shift().toLowerCase();

        // Command aliases
        if (command === 'sqv') command = 'squadvote';
        if (command === 'rv') command = 'regionvote';
        if (command === 'pv') command = 'perspectivevote';
        if (command === 'mv') command = 'mapvote';
        if (command === 'pwd') command = 'password';
        if (command === 'wmwv') command = 'warmodeweaponsvote';
        if (command === 'setvoicelimit') command = 'vclimit';
        if (command === 'wmgv') command = 'warmodegametypevote';
        if (command === 'wv') command = 'weathervote';

        // Grab the command data from the client.commands Enmap
        const cmd = client.commands.get(command);

        // If that command doesn't exist, silently exit and do nothing
        if (!cmd) return;

        // Run the command
        cmd.run(client, message, args);
    } else {
        const directMessageEmbed = {
            color: 0x3366ff,
            title: `Info`,
            description: client.config.directMessage.join(`\n`),
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
            }
        };
        message.channel.send({ embed: directMessageEmbed });
    }
};
