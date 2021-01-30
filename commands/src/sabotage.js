const { color } = require('../../storage/globals.json');

const addCommas = require('./helpers/commas');

const admin = require('firebase-admin');
const db = admin.firestore();

const captureImage = require('./helpers/captureImage');

function isInteger(value) {
  return /^\d+$/.test(value);
}

const run = async (message, args, MessageEmbed, _, args2, DMChannel) => {
  if (message.channel instanceof DMChannel) {
	  return message.channel
			.send('Commands for this bot may not be used inside of a Direct Messages!')
			.catch(console.error);
	}

	if (!args[0]) {
		const givePreview = new MessageEmbed()
			.setTitle('./sabotage')
			.setDescription(`Steal money from any specified user
			\`\`\`css\n ./sabotage [user] [amount] \`\`\``)
			.setColor(color)

		message.channel.send(givePreview);
	}

	let random = Math.floor(Math.random() * 3) + 1;

	let user = message.mentions.members.first();

	let users = db.collection('users');

	let errEmbed = new MessageEmbed()
		.setTitle('Uh Oh!')
		.setColor(color)

		if (!user) return;

		const userDoc = await users.doc(`${user.id}`).get().catch(console.log);
		const personalDoc = await users.doc(`${message.author.id}`).get().catch(console.log);

		if (user.id == message.author.id) {
		  errEmbed.setDescription('You cannot sabotage yourself!')
		  return message.channel.send(errEmbed);
	  }


	if (random == 1) {
		if (personalDoc.exists) {
			if (userDoc.exists) {
				if (args[1]) {
					if(isInteger(args[1])) {
						if (parseInt(args[1]) > 0 && (personalDoc.data().money - parseInt(args[1])) >= 0) {
							let m = userDoc.data().money - parseInt(args[1]);
							if (m < 0) {
								m = 0;
							}

							await db.collection('users').doc(`${user.id}`).update({
								money: m
							}).catch(console.log);

							await db.collection('users').doc(`${message.author.id}`).update({
								money: personalDoc.data().money + parseInt(args[1])
							}).catch(console.log);

							const successEmbed = new MessageEmbed()
								.setTitle('You Sabotaged Successfully!')
								.setDescription(`You sabotaged <@${user.id}> and stole some of their money!`)
								.addField('Your Earnings', `+${args[1]}`)
								.setColor(color)

							message.channel.send(successEmbed);
						} else {
							errEmbed.setDescription('The number you entered was either not valid or was way out of your price range');
							return message.channel.send(errEmbed);
						}
					} else {
						errEmbed.setDescription('The number you specified is not a number. Please try again.');

						return message.channel.send(errEmbed);
					}
				} else {
					errEmbed.setDescription('You need to specify an amount to transfer');

					return message.channel.send(errEmbed);
				}
			} else {
				errEmbed.setDescription(`It seems like the person <@${user.id}> has not registered for *The Money Game*!`);

				return message.channel.send(errEmbed);
			} 
		} else {
			errEmbed.setDescription('It appears you have not registered for *The Money Game*! Do so by running `./init`');

			return message.channel.send(errEmbed);
		}
	} else {
		if (personalDoc.exists) {
			if (userDoc.exists) {
				if (args[1]) {
					if(isInteger(args[1])) {
						if (parseInt(args[1]) > 0 && (personalDoc.data().money - parseInt(args[1])) >= 0) {
							await db.collection('users').doc(`${user.id}`).update({
								money: userDoc.data().money + parseInt(args[1])
							}).catch(console.log);

							let m = personalDoc.data().money - parseInt(args[1]);
							if (m < 0) {
								m = 0;
							}

							await db.collection('users').doc(`${message.author.id}`).update({
								money: m
							}).catch(console.log);

							const successEmbed = new MessageEmbed()
								.setTitle('Nice Try!')
								.setDescription(`You failed sabotage <@${user.id}> and ended up paying them some money!`)
								.addField('Your Loss', `-${args[1]}`)
								.setColor(color)

							message.channel.send(successEmbed);
						} else {
							errEmbed.setDescription('The number you entered was not valid');
							return message.channel.send(errEmbed);
						}
					} else {
						errEmbed.setDescription('The number you specified is not a number. Please try again.');

						return message.channel.send(errEmbed);
					}
				} else {
					errEmbed.setDescription('You need to specify an amount to transfer');

					return message.channel.send(errEmbed);
				}
			} else {
				errEmbed.setDescription(`It seems like the person <@${user.id}> has not registered for *The Money Game*!`);

				return message.channel.send(errEmbed);
			} 
		} else {
			errEmbed.setDescription('It appears you have not registered for *The Money Game*! Do so by running `./init`');

			return message.channel.send(errEmbed);
		}
	}
	
};

module.exports = {
	run,
	info: {
		name: 'sabotage',
		value: '```Gamble your money with another player!```',
		inline: true
	}
};
