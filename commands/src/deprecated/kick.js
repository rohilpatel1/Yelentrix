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
			let details = new MessageEmbed()
				.setTitle('./kick')
				.setDescription('Do ./kick [user] [reason] for kicking a member')
				.setColor(color)
				.addField(
					'Requirements',
					'You must be an admin and the bot must have kicking permissions'
				);
			message.channel.send(details);
		}
		const user = message.mentions.users.first();
		if (user) {
			const member = message.guild.member(user);

			if (member) {
				member.createDM().then(channel => {
					channel
						.send(
							`You were kicked from **${message.guild}**. Reason: ` +
								'```' +
								args2 +
								'```'
						)
						.then(_ => {
							member.kick('Due to breaking rules');
						})
						.then(_ => {
							message.channel.send(
								`${user.tag} was successfully kicked from the server`
							);
						})
						.catch(err => {
							message.channel.send(err);
							console.log(err);
						});
				});
			} else {
				message.channel.send('That specified user is not in the server.');
			}
		} else {
			return;
		}
	} else {
		message.channel.send(
			'You need administrator privileges to perform this action.'
		);
	}
};

module.exports = {
	run,
	info: {
		command: 'kick [user] [reason]',
		des: 'kicks a user from the guild'
	}
};
