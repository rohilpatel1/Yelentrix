const { color } = require('../../storage/globals.json');

function captureImage(name) {
	return `https://Hosting.rohilpatel.repl.co/${name}.jpeg`;
};

const run = (message, args, MessageEmbed, _, args2, DMChannel) => {
  if (message.channel instanceof DMChannel) {
	  message.channel
			.send('Commands for this bot may not be used inside of a Direct Messages!')
			.catch(console.error);
	  return;
	}

	let InviteEmbed = new MessageEmbed()
	  .setTitle('Invite Yelentrix to Your Server!')
		.setColor(color)
		.setDescription('**Invite Link**: [Link](https://discord.com/api/oauth2/authorize?client_id=777667558169116703&permissions=130048&scope=bot) \n\n **Discord Server**: [Invite](https://discord.gg/hG98v2uf6S) \n\n **Github**: [Repository](https://github.com/rohilpatel1/Yelentrix)')

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