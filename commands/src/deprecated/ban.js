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
				.setTitle('./ban')
				.setDescription('Do ./ban [user] [reason] for banning a member')
				.setColor(color)
				.addField(
					'Requirements',
					'You must be an admin and the bot must have banning permissions'
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
							`You were banned from **${message.guild}**. Reason: ` +
								'```' +
								args2 +
								'```'
						)
						.then(_ => {
							member.ban({ reason: 'Due to breaking rules' });
						})
						.then(_ => {
							message.channel.send(
								`${user.tag} was successfully banned from the server`
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
			'You need Administrator privileges to perform this action.'
		);
	}
};

module.exports = {
	run,
	info: {
		command: 'ban [user] [reason]',
		des: 'bans a user from the guild'
	}
};
