const { color } = require('../../storage/globals.json');

const captureImage = require('./helpers/captureImage');

const run = (message, args, MessageEmbed, commandData, args2, DMChannel) => {
	if (message.channel instanceof DMChannel) {
		message.channel
			.send(
				'Commands for this bot may not be used inside of a Direct Messages!'
			)
			.catch(console.error);
		return;
	}

	const HelpOverview = new MessageEmbed()
		.setTitle('Showing Help Menu For Yelentrix')
		.setDescription('The command syntax is in the form: \n ```css\n ./[command] [argument] [argument] [arguments...``` ')
		.setColor(color)
		.setFooter('Yelentrix', captureImage('yelentrix2'))
		.setTimestamp()
		

	commandData.splice(0, 1);
	commandData.splice(7, 1);
	commandData.splice(2, 1);
	
	HelpOverview.addFields(
		commandData
	)


	message.channel.send(HelpOverview);
	//message.channel.send(helpPersonal);
};

module.exports = { run };