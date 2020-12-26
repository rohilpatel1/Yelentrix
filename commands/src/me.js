const { color } = require('../../storage/globals.json');

const admin = require('firebase-admin');

const addCommas = require('./helpers/commas');

const db = admin.firestore();

const captureImage = require('./helpers/captureImage');

const run = async(message, args, MessageEmbed, _, args2, DMChannel) => {
	if (message.channel instanceof DMChannel) {
		return message.channel
			.send('Commands for this bot may not be used inside of a Direct Messages!')
			.catch(console.error);
	}

	let meEmbed = new MessageEmbed()
		.setTitle('Your Financial Statistics')
		.setColor(color)
		.setThumbnail(message.author.avatarURL());

	const users = db.collection('users');
	const doc = await users.doc(`${message.author.id}`).get().catch(console.log)

	if (doc.exists) {
		meEmbed
			.addField('Money', `$${addCommas(doc.data().money)}`)
			.addField('Paycheck', `$${addCommas(doc.data().moneyPerDay)}/day`)
			.addField('Most Recent Activity', doc.data().lastDailyReward)
			.setFooter('Yelentrix', captureImage('yelentrix2'))
			.setTimestamp()
	} else {
		meEmbed.setDescription('You have not registered for *The Money Game*! To start, type `./init`');
	}

	message.channel.send(meEmbed);
};

module.exports = {
	run,
	info: {
		name: 'me',
		value: '```Gives financial statistics about yourself```',
		inline: true
	}
};