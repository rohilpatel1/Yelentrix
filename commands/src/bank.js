const { color } = require('../../storage/globals.json');
const addCommas = require('./helpers/commas');

const admin = require('firebase-admin');
const db = admin.firestore();
const captureImage = require('./helpers/captureImage');

function isInteger(value) {
  return /^\d+$/.test(value);
}

const run = async(message, args, MessageEmbed, _, args2, DMChannel) => {
  if (message.channel instanceof DMChannel) {
	  return message.channel
			.send('Commands for this bot may not be used inside of a Direct Messages!')
			.catch(console.error);
	}

	let users = db.collection('users');

	const doc = await users.doc(message.author.id).get().catch(console.log);

	let { bank, upgradeBank, bankCapacity } = doc.data();

	if (bank == null && upgradeBank == null && bankCapacity == null) {
		let res = await users.doc(message.author.id).set({
			bank: 0,
			bankCapacity: 1000,
			upgradeBank: 5000
		}, { merge: true });

		if (!res) return message.channel.send('An error occured. Please try again later.');

		let createdAccount = new MessageEmbed()
			.setTitle('You opened your bank!')
			.setDescription('Your bank account was successfully created! Run some more commands with `./bank` to start optimizing it!')
			.setColor(color)

		message.channel.send(createdAccount);
	}

	if (!args[0]) {
		let bankPrev = new MessageEmbed()
			.setTitle('./bank')
			.setDescription(`Handles a bank to store money
			\`\`\`css\n ./bank [argument] \`\`\``)
			.addField('./bank expand', 'Shows bank expansion plan')
			.addField('./bank withdraw [amount]', 'Withdraws a certain amount of money')
			.addField('./bank deposit [amount]', 'Deposits money into your bank')
			.setTimestamp()
			.setColor(color)
			.setFooter('Yelentrix', captureImage('yelentrix2'))

		return message.channel.send(bankPrev);
	}

	switch (args[0]) {
		case 'expand': {
			const doc = await users.doc(message.author.id).get().catch(console.log);

			if (args[1] == 'confirm' && doc.data().money >= doc.data().upgradeBank) {
				let res = await users.doc(message.author.id).update({
					bankCapacity: doc.data().bankCapacity + 1000,
					money: doc.data().money - doc.data().upgradeBank,
					upgradeBank: doc.data().upgradeBank * 2
				});

				if (!res) return message.channel.send('An error occured. Please try again later.')

				let successsEmbed = new MessageEmbed()
					.setTitle('Congratulations!')
					.setDescription('You have successfully upgraded your bank! Now you can deposit more money to keep your money safe!')
					.setTimestamp()
					.setColor(color)
					.setFooter('Yelentrix', captureImage('yelentrix2'))

					return message.channel.send(successsEmbed);
			}

			if (doc.exists) {
				const  { money, upgradeBank, bankCapacity } = doc.data();

				if (money >= upgradeBank) {

					let confirmEmbed = new MessageEmbed()
						.setTitle('Upgrade Your Bank Capacity')
						.setDescription(`You have $${addCommas(money)}, and you have enough to upgrade your bank capacity! Pay $${addCommas(upgradeBank)} to do so! Type \`./bank expand confirm\` to upgrade!`)
						.setTimestamp()
						.setColor(color)
						.setFooter('Yelentrix', captureImage('yelentrix2'))

						message.channel.send(confirmEmbed);
				} else {
					message.channel.send(`In order to upgrade your bank you must have $${addCommas(upgradeBank)}, however you only have $${addCommas(money)}.`);
				}

				

			} else {
				return message.channel.send('You have not registered for *The Money Game*! Do so by running `./init`')
			}

			break;
		}
		case 'deposit': {
			const doc = await users.doc(message.author.id).get().catch(console.log);

			if (!args[1]) {
				return message.channel.send('You need to specify an amount to deposit!');
			} else {
				if (isInteger(args[1]) && (parseInt(args[1]) + doc.data().bank) <= doc.data().bankCapacity && parseInt(args[1]) <= doc.data().money) {
					let res = await users.doc(message.author.id).update({
						money: doc.data().money - parseInt(args[1]),
						bank: doc.data().bank + parseInt(args[1])
					}).catch(console.log);

					if (!res) return message.channel.send('An error occured. Please try again later.');

					let sucE = new MessageEmbed()
						.setTitle('Success!')
						.setDescription(`The transfer went well! $${doc.data().bank + parseInt(args[1])} is safely in your bank`)
						.setColor(color);

					message.channel.send(sucE);
				} else {
					return message.channel.send('The number you entered is either not within your capacity, you don\'t have it, or is simply not a number ');
				}
			}
			break;
		}

		case 'withdraw':
			const doc = await users.doc(message.author.id).get().catch(console.log);

				if (!args[1]) {
					return message.channel.send('You need to specify an amount to withdraw!');
				} else {
					if (isInteger(args[1]) && parseInt(args[1]) <= doc.data().bank) {
						let res = await users.doc(message.author.id).update({
							money: doc.data().money + parseInt(args[1]),
							bank: doc.data().bank - parseInt(args[1])
						}).catch(console.log);

						if (!res) return message.channel.send('An error occured. Please try again later.');

						let sucE = new MessageEmbed()
							.setTitle('Success!')
							.setDescription(`The withdrawal went well! $${addCommas(doc.data().money + parseInt(args[1]))} is now in your wallet`)
							.setColor(color);

						message.channel.send(sucE);
					} else {
						return message.channel.send('The number you entered is either not within your capacity, you don\'t have it, or is simply not a number ');
					}
				}
				break;
	}
};

module.exports = {
	run,
	info: {
		name: 'bank',
		value: '```Configures with bank settings```',
		inline: true
	}
};