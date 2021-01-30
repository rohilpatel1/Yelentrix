const { color } = require('../../storage/globals.json');

function captureImage(name) {
	return `https://Hosting.rohilpatel.repl.co/${name}.jpeg`;
};

const run = (message, args, MessageEmbed, commandData, args2, DMChannel) => {
	if (message.channel instanceof DMChannel) {
		return message.channel
			.send('Commands for this bot may not be used inside of a Direct Messages!')
			.catch(console.error);
	}

	commandData.push({
		name: 'stats',
		value: '```Gives useful bot statistics```',
		inline: true
	})

	if (!args[0]) {
		const HelpOverview = new MessageEmbed()
		.setTitle('Yelentrix Help Commands')
		.setDescription('```css\n ./help [category]``` ')
		.addField('game', '```Shows game commands```')
		.addField('dev', '```Shows developer commands```')
		.addField('other', '```Shows extra commands```')
		.setColor(color)
		

	//commandData.splice(0, 1);
	//commandData.splice(7, 1);
  //commandData.splice(2, 1);
	
	//HelpOverview.addFields(
	//	commandData
	//)

	//console.log(commandData);
	return message.channel.send(HelpOverview);
	//message.channel.send(helpPersonal);
	}

	let tempEmbed, validSpots;

	switch (args[0]) {
		case 'game':
			const gameEmbed = new MessageEmbed()
				.setTitle('Showing List of Game Commands for Yelentrix')
				.setColor(color)
				.setDescription('Below you can find a list of commands for the game section');

			tempEmbed = [];

			validSpots = [1, 2, 5, 9, 10, 6, 7, 11, 12]

			for (let i = 0; i < validSpots.length; i++) {
				tempEmbed.push(commandData[validSpots[i]]);
			}

			gameEmbed.addFields(tempEmbed);

			message.channel.send(gameEmbed);
			break;

		case 'dev':
			const devEmbed = new MessageEmbed()
				.setTitle('Showing List of Developer Commands for Yelentrix')
				.setColor(color)
				.setDescription('Below you can find a list of commands for the developer section');

			tempEmbed = [];

			validSpots = [3, 13]

			for (let i = 0; i < validSpots.length; i++) {
				tempEmbed.push(commandData[validSpots[i]]);
			}
			
			devEmbed.addFields(tempEmbed);

			message.channel.send(devEmbed);
			break;
		
		case 'other':
			const otherEmbed = new MessageEmbed()
				.setTitle('Showing List of Other Commands for Yelentrix')
				.setColor(color)
				.setDescription('Below you can find a list of commands for the game section');

			tempEmbed = [];

			validSpots = [4, 8]

			for (let i = 0; i < validSpots.length; i++) {
				tempEmbed.push(commandData[validSpots[i]]);
			}
			
			otherEmbed.addFields(tempEmbed);

			message.channel.send(otherEmbed);
			break;
	}

};

module.exports = { run };