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

	let InviteEmbed = new MessageEmbed()
	  .setTitle('Invite Yelentrix to Your Server!')
		.setColor(color)
		.setDescription('Use the following link to invite Yelentrix to your server!')
		.addField('Link', 'https://discord.com/api/oauth2/authorize?client_id=777667558169116703&permissions=8&scope=bot')

	message.channel.send(InviteEmbed);
};

module.exports = {
	run,
	info: {
		name: 'invite',
		value: '```provides link to invite bot to server```',
		inline: true
	}
};