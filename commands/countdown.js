exports.run = async (client, message, args) => {
    let seconds = args;
    const games_channel = client.channels.get(client.config.games_channel_id);
    games_channel
        .send('Countdown: ' + seconds + 's')
        .then(message => {
            const countInterval = setInterval(() => {
                if (seconds === '0') {
                    message.edit((seconds = 'Countdown complete.'));
                    return clearInterval(countInterval);
                }
                message.edit('Countdown: ' + (seconds = seconds - 10) + 's');
            }, 10000);
        })
        .catch(console.error);
};
