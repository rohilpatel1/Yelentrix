const admin = require('firebase-admin');

const prefix = './';

let commandNames = ['help', 'me', 'user', 'version', 'insult', 'init', 'daily', 'upgrade', 'invite', 'trivia'];

let commandData = [];

commandNames.forEach(name => {
	const mod = require(`./src/${name}`);
	let info = { name, value: 'nothing' };

	if (mod.info) {
		info = mod.info;
	}
	commandData.push(info);
});

function Commands(message, MessageEmbed, DMChannel) {
	if (!message.content.startsWith(prefix)) return;

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(' ');

	const args2 = message.content.substring(prefix.length).slice(27);

	const command = args.shift().toLowerCase();

	if (commandNames.indexOf(command) > -1) {
		require(`./src/${command}`).run(
			message,
			args,
			MessageEmbed,
			commandData,
			args2,
			DMChannel
		);
	}
}

module.exports = { Commands, commandData };
