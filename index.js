// Require discord.js module
const Discord = require('discord.js');

// Create client
const client = new Discord.Client();

// Require config file
const config = require(`./config.json`);

// Post in console when ready
client.once('ready', () => {
	console.log('Ready!');
});

// Debug errors
client.on(`error`, (e) => console.error(e));
client.on(`warn`, (e) => console.warn(e));
client.on(`debug`, (e) => console.info(e));

// Login using code from config file
client.login(config.token);

// Start parsing messages

client.on("message", async message => {
  // Ignore bots own messages.
  if(message.author.bot) return;

  // Ignore messages that do not begin with the prefix.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
});
