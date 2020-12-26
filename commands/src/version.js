const { color } = require('../../storage/globals.json');
const { version, description, botUpdated } = require('../../storage/build.json')[0];

const captureImage = require('./helpers/captureImage');

const run = (message, args, MessageEmbed, _, args2, DMChannel) => {
	if (message.channel instanceof DMChannel) {
		return message.channel
			.send('Commands for this bot may not be used inside of a Direct Messages!')
			.catch(console.error);
	}

	const versionEmbed = new MessageEmbed()
		.setTitle(`Version ${version}`)
		.setDescription(description)
		.setColor(color)
		.setFooter(`Last updated ${botUpdated}`, captureImage('yelentrix2'))

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