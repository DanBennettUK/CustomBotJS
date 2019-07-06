exports.run = async (client, message, args) => {
    const ping_message = await message.channel.send('Ping?');
    ping_message
        .edit(
            `Pong! Latency is ${ping_message.createdTimestamp -
                message.createdTimestamp}ms. API Latency is ${Math.round(
                client.ping
            )}ms`
        )
        .catch(console.error);
};
