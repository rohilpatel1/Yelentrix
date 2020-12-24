const { color } = require('../../storage/globals.json');
const admin = require('firebase-admin');

const addCommas = require('./helpers/commas');

const captureImage = require('./helpers/captureImage');

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

	if (!args[0]) {
		const upgradePreview = new MessageEmbed()
			.setTitle('Personal Upgrade Plans')
			.setColor(color)
			.setFooter('Yelentrix', captureImage('yelentrix2'))
			.setTimestamp();

		db.collection('users')
			.doc(`${message.author.id}`)
			.get()
			.then(doc => {
				if (doc.exists) {
					let { moneyNeededToDouble, money } = doc.data();

					if (money >= moneyNeededToDouble) {
						upgradePreview.setDescription(
							`You have $${addCommas(money)}. To upgrade your daily paycheck, you can spend $${addCommas(moneyNeededToDouble)} by entering the command ` +
								'`./upgrade confirm`' +
								'!'
						);
					} else {
						upgradePreview.setDescription(
							`You have $${addCommas(money)}, and to upgrade your daily paycheck, you must have $${addCommas(moneyNeededToDouble)}`
						);
					}
				} else {
					upgradePreview.setDescription(
						'You are not a member of *The Money Game*! Run `./init` to add yourself!'
					);
				}

				message.channel.send(upgradePreview);
			})
			.catch(console.error);

		return;
	}

	if (args[0] == 'confirm') {
		db.collection('users')
			.doc(`${message.author.id}`)
			.get()
			.then(doc => {
				let { moneyNeededToDouble, money, moneyPerDay } = doc.data();

				if (moneyNeededToDouble > money) {
					message.channel.send(
						"You don't have the funds necessary to uprade your paycheck. Enter `./upgrade` for more details."
					);

					return;
				} else {
					db.collection('users')
						.doc(`${message.author.id}`)
						.update({
							moneyNeededToDouble: moneyNeededToDouble * 3,
							money: money - moneyNeededToDouble,
							moneyPerDay: moneyPerDay * 2
						})
						.then(_ => {
							message.channel.send(
								`Congrats! Each day, you now earn $${moneyPerDay * 2}! `
							);
						})
						.catch(console.error);
				}
			})
			.catch(console.error);
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
