const { color } = require('../../storage/globals.json');
const admin = require('firebase-admin');

const addCommas = require('./helpers/commas');

function captureImage(name) {
		return `https://Hosting.rohilpatel.repl.co/${name}.jpeg`;
	};

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

	let mention = message.mentions.members.first();

	if (!mention) {
		const userPreview = new MessageEmbed()
			.setTitle('./user')
			.setDescription(
				`Gives financial statistics about a given user
				\`\`\`css\n ./user [mention] \`\`\`
				`
			)
			.setColor(color)
			.setTimestamp()
			.setFooter('Yelentrix', captureImage('yelentrix'))
		message.channel.send(userPreview);

		return;
	}
	let meEmbed = new MessageEmbed()
		.setTitle(`${mention.user.username}'s Financial Statistics`)
		.setColor(color)
		.setThumbnail(mention.user.avatarURL());
	/*.addField('User Identification', mention.id)
		.addField('Joined Server', mention.joinedAt.toDateString())
		.addField('Joined Discord', mention.user.createdAt.toDateString());*/

	const users = db.collection('users');
	users
		.doc(`${mention.id}`)
		.get()
		.then(doc => {
			if (doc.exists) {
				meEmbed
					.addField('Money', `$${addCommas(doc.data().money)}`)
          .addField('Paycheck', `$${addCommas(doc.data().moneyPerDay)}/day`)
          .addField('Most Recent Activity', doc.data().lastDailyReward)
			} else {
				meEmbed.setDescription(
					'This user has not registered for *The Money Game*!'
				);
			}
		})
		.then(_ => {
		  message.channel.send(meEmbed);
		})
		.catch(err => {
			console.log(err);
		});
};

module.exports = {
	run,
	info: {
		name: 'user',
		value: '```Gives financial info on mentioned person```',
		inline: true
	}
};
