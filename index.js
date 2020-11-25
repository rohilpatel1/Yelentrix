const { Client, MessageEmbed, DMChannel } = require('discord.js');

const { token } = process.env;

require('./firebase/firebase');

const client = new Client();

client.on('ready', _ => {
	client.user.setPresence({
		status: 'dnd',
		activity: {
			name: './help',
			type: 'LISTENING'
		}
	});
	console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', message => {
	require('./commands/commands').Commands(message, MessageEmbed, DMChannel);
});

require('./server/server');

client.login(token);