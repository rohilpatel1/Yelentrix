const { color } = require('../../storage/globals.json');
const { version, description } = require('../../storage/build.json')[0];

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

	const versionEmbed = new MessageEmbed()
		.setTitle(`Version ${version}`)
		.setDescription(description)
		.setColor(color)
		.setFooter('Yelentrix', captureImage('yelentrix'))
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
