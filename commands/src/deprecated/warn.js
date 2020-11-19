const { color } = require('../../storage/globals.json');

const run = (message, args, MessageEmbed, _, args2, DMChannel) => {
	if (message.channel instanceof DMChannel) {
		message.channel
			.send(
				'Commands for this bot may not be used inside of a Direct Messages!'
			)
			.catch(console.error);
		return;
	}

	if (message.member.hasPermission('ADMINISTRATOR')) {
		if (!args[0]) {
			let warnEmbed = new MessageEmbed()
				.setTitle('./warn')
				.setDescription("Send warning to user's direct messages")
				.setColor(color)
				.addField(
					'Requirements',
					'You must have administrator permissions to send warnings.'
				)
				.addField('Syntax', 'warn [user] [reason]');
			message.channel.send(warnEmbed);
		}
		const user = message.mentions.users.first();
		if (user) {
			const member = message.guild.member(user);

			member.createDM().then(channel => {
				channel
					.send(
						`You were warned in **${message.guild}**. Reason: ` +
							'```' +
							args2 +
							'```'
					)
					.then(_ => {
						message.channel.send(`${user.tag} was warned successfully!`);
					})
					.catch(err => {
						console.log(err);
					});
			});
		}
	}
};

module.exports = {
	run,
	info: {
		command: 'warn [user] [reason]',
		des: 'warns a person by sending a direct message'
	}
};
