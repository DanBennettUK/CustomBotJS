exports.run = async (client, message, args) => {
	if (message.channel.id !== client.config.host_channel_id) {
		// If the command isn't ran in the host channel, do nothing.
		return;
	}

	// Get customRole for pinging later
	const customRole = message.guild.roles.find(
		findRole => findRole.id === client.config.custom_role_id
	);

	const host_channel = client.channels.get(client.config.host_channel_id);
	const games_channel = client.channels.get(client.config.games_channel_id);
	const title = 'Custom Game Server Details';
	const footerText = '© DanBennett';

	console.error('Password is: ' + args[0]);
	console.error('Timer is: ' + args[1]);
	console.error('ServerName is: ' + args[2]);

	let serverPassword = args[0];
	let timer = args[1];
	let serverName = args[2];
	let raiseError = false;
	let timeLeft;
	let timerText;

	if (typeof serverPassword === 'undefined') {
		if (client.config.default_game_server_password !== '') {
			serverPassword = client.config.default_game_server_password;
		}
		else {
			console.error('1');
			raiseError = true;
		}
	}
	if (typeof serverName === 'undefined') {
		if (client.config.default_game_server_name !== '') {
			serverName = client.config.default_game_server_name;
		}
		else {
			console.error('2');
			raiseError = true;
		}
	}

	if (typeof timer === 'undefined') {
		timer = client.config.default_timer;
	}
	else if (isNaN(timer)) {
		console.error('3');
		raiseError = true;
	}

	if (raiseError === true) {
		const error = {
			color: 0xff0000,
			title: 'Error!',
			fields: [
				{
					name: 'One or more of your arguments are wrong',
					value:
						'Ensure you follow the correct format: \n<password> [minutes] [servername] \nOptions in []\'s are optional',
				},
			],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: `${footerText}`,
			},
		};
		host_channel.send({ embed: error });
		return;
	}
	else {
		timeLeft = timer;
	}

	if (timer === '1') {
		timerText = 'minute';
	}
	else {
		timerText = 'minutes';
	}

	const passwordMessage = {
		color: 0x009900,
		title: `${title}`,
		fields: [
			{
				name: 'Server Name:',
				value: `${serverName}`,
			},
			{
				name: 'Password:',
				value: `${serverPassword}`,
			},
		],
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL,
			text: `${footerText}`,
		},
	};

	const prePasswordMessage = {
		color: 0x3366ff,
		title: `${title}`,
		fields: [
			{
				name: 'The password will be posted in:',
				value: `${timeLeft} ${timerText}!`,
			},
		],
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL,
			text: `${footerText}`,
		},
	};

	try {
		await games_channel
			.send({ embed: prePasswordMessage })
			.then(async embedMessage => {
				setTimeout(function() {
					embedMessage.delete();

					games_channel.send({ embed: passwordMessage });
					if (client.config.custom_role_ping == true) {
						customRole
							.setMentionable(true, 'Role needs to be pinged')
							.catch(console.error);
						games_channel.send(
							customRole + ' - the password is above!'
						);
						setTimeout(function() {
							customRole
								.setMentionable(
									false,
									'Role no longer needs to be pinged'
								)
								.catch(console.error);
						}, 20000);
					}
					if (client.config.host_channel_messages === true) {
						host_channel.send('Password has been posted!');
					}
				}, timer * 60 * 1000);
			});
	}
	catch (error) {
		console.log(`${error}`);
	}
};
