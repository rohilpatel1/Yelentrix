const { color } = require('../../storage/globals.json');
const { version, description } = require('../../storage/build.json')[0];

const captureImage = require('./helpers/captureImage');

const run = (message, args, MessageEmbed, _, args2, DMChannel) => {
	if (message.channel instanceof DMChannel) {
		message.channel
			.send(
				'Commands for this bot may not be used inside of a Direct Messages!'
			)
			.catch(console.error);
		return;
	}

	const versionEmbed = new MessageEmbed()
		.setTitle(`Version ${version}`)
		.setDescription(description)
		.setColor(color)
		.setFooter('Yelentrix', captureImage('yelentrix2'))
		.setTimestamp()

	message.channel.send(versionEmbed);
};

module.exports = {
	run,
	info: {
		name: 'version',
		value: '```Gives version or build that bot is running```',
    inline: true
	}
};
