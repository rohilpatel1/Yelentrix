const { color } = require('../../storage/globals.json');
const admin = require('firebase-admin');

const addCommas = require('./helpers/commas');

const captureImage = require('./helpers/captureImage');

const db = admin.firestore();

const run = async(message, args, MessageEmbed, _, args2, DMChannel) => {
	if (message.channel instanceof DMChannel) {
		return message.channel
			.send('Commands for this bot may not be used inside of a Direct Messages!')
			.catch(console.error);
	}

	if (!args[0]) {
		const upgradePreview = new MessageEmbed()
			.setTitle('Personal Upgrade Plans')
			.setColor(color)
			.setFooter('Yelentrix', captureImage('yelentrix2'))
			.setTimestamp();

		let doc = await db.collection('users').doc(`${message.author.id}`).get().catch(console.log);

		if (doc.exists) {
			let { moneyNeededToDouble, money } = doc.data();

			if (money >= moneyNeededToDouble) {
				upgradePreview.setDescription(`You have $${addCommas(money)}. To upgrade your daily paycheck, you can spend $${addCommas(moneyNeededToDouble)} by entering the command ` + '`./upgrade confirm`' +'!');
			} else {
				upgradePreview.setDescription(`You have $${addCommas(money)}, and to upgrade your daily paycheck, you must have $${addCommas(moneyNeededToDouble)}`);
			}
		} else {
			upgradePreview.setDescription('You are not a member of *The Money Game*! Run `./init` to add yourself!');
		}

		return message.channel.send(upgradePreview);
	}

	if (args[0] == 'confirm') {
		let document = await db.collection('users').doc(`${message.author.id}`).get().catch(console.log);

		let { moneyNeededToDouble, money, moneyPerDay } = document.data();

		if (moneyNeededToDouble > money) {
			return message.channel.send("You don't have the funds necessary to uprade your paycheck. Enter `./upgrade` for more details.");
		} else {
			let res = await db.collection('users').doc(`${message.author.id}`).update({
				moneyNeededToDouble: moneyNeededToDouble * 3,
				money: money - moneyNeededToDouble,
				moneyPerDay: moneyPerDay * 2
			});

			if (!res) return message.channel.send('An error occured. Please try again later!')
			
			message.channel.send(`Congrats! Each day, you now earn $${moneyPerDay * 2}! `)
		}
	}
};

module.exports = {
	run,
	info: {
		name: 'upgrade',
		value: '```potentially increase daily paycheck amount```',
		inline: true
	}
};
