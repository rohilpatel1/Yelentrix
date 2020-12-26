const { Client, MessageEmbed, DMChannel } = require('discord.js');

const { version } = require('./storage/build.json')[0];

const addCommas = require('./commands/src/helpers/commas');

const { token } = process.env;

require('./firebase/firebase');
const moment = require('moment');
require("moment-duration-format");

const client = new Client();

client.on("unhandledRejection", err => {
	console.log(err);
});

client.on('ready', _ => {
	client.user.setPresence({
		status: 'dnd',
		activity: {
			name: `./help | v${version}`,
			type: 'LISTENING'
		}
	});
	console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', message => {
	require('./commands/commands').Commands(message, MessageEmbed, DMChannel);

	switch (message.content) {
		case './stats':
			const duration = moment.duration(client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]");

			let users = 0;
    	for (let g of client.guilds.cache.array()) {
				users += g.memberCount;
			}

			const statEmbed = new MessageEmbed()
				.setTitle('Yelentrix Statistics')
				.addField('Uptime', duration)
				.addField('Servers In', client.guilds.cache.size)
				.addField('Watching', `${addCommas(users)} Users`)
				.setColor(0xd32cdb)

			message.channel.send(statEmbed);
	}
});

require('./server/server');

client.login(token);