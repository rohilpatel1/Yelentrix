const { color } = require('../../storage/globals.json');

const addCommas = require('./helpers/commas');

function captureImage(name) {
		return `https://Hosting.rohilpatel.repl.co/${name}.jpeg`;
};

const admin = require('firebase-admin');

const db = admin.firestore();

const run = (message, args, MessageEmbed, _, args2, DMChannel) => {
	if (message.channel instanceof DMChannel) {
		message.channel
			.send(
				'Commands for this bot may not be used inside of a Direct Messages!'
			)
			.catch(console.error);
		return;
	}

	db.collection('users')
		.get()
		.then(querySnapshot => {
			let data = [];

			querySnapshot.forEach(doc => {
				data.push(doc.data());
			});

			data.sort((a, b) => {
				return b.money - a.money;
			});

			let leaderboardEmbed = new MessageEmbed()
				.setTitle('Showing Leaderboard for *The Money Game*!')
				.setDescription('Below you will find the top 10 richest people!')
				.setColor(color)
				.setTimestamp()
				.setFooter('Yelentrix', captureImage('yelentrix'))

			for (let i = 0; i < 10; i++) {
				leaderboardEmbed.addField(
					`Position #${i + 1}`,
					`<@${data[i].userID}> - $${addCommas(data[i].money)}`
				);
			}

			message.channel.send(leaderboardEmbed);
		})
		.catch(console.log);
};

module.exports = {
	run,
	info: {
		name: 'leaderboard',
		value: '```Shows top 10 richest players in the world```',
		inline: true
	}
};
