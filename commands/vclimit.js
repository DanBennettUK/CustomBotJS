exports.run = async (client, message, args) => {

    if (message.channel.id !== client.config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    
    const host_channel = client.channels.get(client.config.host_channel_id);
    let error;

    if (args[0] > -1 && args[0] < 100) {
        client.channels.forEach(channel => {
            if (channel.type == 'voice') {
                if (
                    channel.name.startsWith(client.config.voice_channel_emoji)
                ) {
                    try {
                        channel.setUserLimit(args[0]).catch(console.error);
                    }
                    catch (errorlog) {
                        console.log(`${errorlog}`);
                    }
                }
            }
        });
        host_channel.send(`Voice limit set to ${args[0]}`);
    }
    else if (isNaN(args[0])) {
        error = true;
    }
    else {
        error = true;
    }
    if (error === true) {
        const errorMessage = {
            color: 0xff0000,
            title: 'Error!',
            fields: [
                {
                    name: 'One or more of your arguments are wrong',
                    value:
                        'Number must be a number and between 1 and 99, or 0 to remove the limit.',
                },
            ],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
            },
        };
        host_channel.send({ embed: errorMessage });
        return;
    }
};
