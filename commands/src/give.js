const { color } = require('../../storage/globals.json');

const addCommas = require('./helpers/commas');

const captureImage = require('./helpers/captureImage');

const admin = require('firebase-admin');

const db = admin.firestore();

function isInteger(value) {
  return /^\d+$/.test(value);
}

const run = async(message, args, MessageEmbed, _, args2, DMChannel) => {
  if (message.channel instanceof DMChannel) {
	  return message.channel
			.send(
				'Commands for this bot may not be used inside of a Direct Messages!'
			)
			.catch(console.error);
	}

	if (!args[0]) {
		const givePreview = new MessageEmbed()
			.setTitle('./give')
			.setDescription(`Gives money to specified user
			\`\`\`css\n ./give [user] [amount] \`\`\``)
			.setColor(color)

		message.channel.send(givePreview);
	}

	let errEmbed = new MessageEmbed()
		.setTitle('Uh Oh!')
		.setColor(color)
		.setTimestamp()
		.setFooter('Yelentrix', captureImage('yelentrix2'))

	let user = message.mentions.members.first();

	if (!user) return;

	const userDoc = await db.collection('users').doc(`${user.id}`).get().catch(_ => {});
	const personalDoc = await db.collection('users').doc(`${message.author.id}`).get().catch(_ => {});

	if (user.id == message.author.id) {
		errEmbed.setDescription('You cannot give money to yourself!')
		return message.channel.send(errEmbed);
	}

	if (personalDoc.exists && userDoc.exists) {
		if (args[1]) {
			if(isInteger(args[1])) {
				if (parseInt(args[1]) > 0 && (personalDoc.data().money - parseInt(args[1])) >= 0) {
					await db.collection('users').doc(`${user.id}`).update({
						money: userDoc.data().money + parseInt(args[1])
					}).catch(console.log);

					await db.collection('users').doc(`${message.author.id}`).update({
						money: personalDoc.data().money - parseInt(args[1])
					}).catch(console.log);

					const successEmbed = new MessageEmbed()
						.setTitle('Success!')
						.setDescription(`The transaction between you and <@${user.id}> was successful!`)
						.setTimestamp()
						.addField('Your Balance', `${personalDoc.data().money} → **${personalDoc.data().money - parseInt(args[1])}**`)
						.addField(`${user.user.username}'s Balance`, `${userDoc.data().money} → **${userDoc.data().money + parseInt(args[1])}**`)
						.setColor(color)
						.setFooter('Yelentrix', captureImage('yelentrix2'))

					message.channel.send(successEmbed);
				} else {
					errEmbed.setDescription('The number you entered either was not valid, or you wanted to give money out of your price range.');
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
		errEmbed.setDescription('Either you or the user you mentioned are not part of *The Money Game*, so the transaction failed.');

		return message.channel.send(errEmbed);
	}
	
};

module.exports = {
	run,
	info: {
		name: 'give',
		value: '```Give free money to people you specify!```',
		inline: true
	}
};