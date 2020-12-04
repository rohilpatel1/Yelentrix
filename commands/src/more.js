const { color } = require('../../storage/globals.json');

function captureImage(name) {
	return `https://Hosting.rohilpatel.repl.co/${name}.jpeg`;
};

const run = (message, args, MessageEmbed, _, args2, DMChannel) => {
  if (message.channel instanceof DMChannel) {
	  message.channel
			.send(
				'Commands for this bot may not be used inside of a Direct Messages!'
			)
			.catch(console.error);
	  return;
	}
	
	const moreEmbed = new MessageEmbed()
	  .setTitle('Showing More Commands For Yelentrix')
	  .addField('./version', 'Gives version of bot')
	  .addField('./invite', 'Provides invite to bot')
	  .setColor(color)
	  .setTimestamp()
	  .setFooter('Yelentrix', captureImage('yelentrix'))
	
	message.channel.send(moreEmbed);
};

module.exports = {
	run,
	info: {
		name: 'more',
		value: '```shows other less prominent commands```',
		inline: true
	}
};
