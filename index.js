// Require discord.js module
const Discord = require('discord.js');

// Other Requirements from module
const { Client, RichEmbed } = require('discord.js');

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
  if (message.author.bot) return;

  // Ignore messages that do not begin with the prefix.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Help command
  if (command === `help`) {
    if (!message.member.roles.some(role => role.id === config.host_role_id)) {
      const helpEmbed = new Discord.RichEmbed()
        .setColor('ffffff')
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setDescription(`**General Commands for users**
    \`${config.prefix}help\` - lists all commands
    \`${config.prefix}ping\` - checks Discord API response`)
        .setTimestamp()
        .setFooter(`Version: ${config.version}`);
      message.channel.send(helpEmbed);
    } else if (message.member.roles.some(role => role.id === config.host_role_id)) {
      const hostHelpEmbed = new Discord.RichEmbed()
        .setColor('ffffff')
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setDescription(`**General Commands for hosts**
        \`${config.prefix}help\` - lists all commands
        \`${config.prefix}ping\` - checks Discord API response`)
        .setTimestamp()
        .setFooter(`Version: ${config.version}`);
      message.channel.send(hostHelpEmbed);
    }
  }

  // Ping command
  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const ping_message = await message.channel.send("Ping?");
    ping_message.edit(`Pong! Latency is ${ping_message.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }



});
