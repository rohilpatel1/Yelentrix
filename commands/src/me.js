const { color } = require('../../storage/globals.json');

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

	let meEmbed = new MessageEmbed()
		.setTitle(message.author.username)
		.setColor(color)
		.setThumbnail(message.author.avatarURL())
		.addField('User Identification', message.author.id)
		.addField('Joined Server', message.member.joinedAt.toDateString())
		.addField('Joined Discord', message.author.createdAt.toDateString());

	const users = db.collection('users');
	users
		.doc(`${message.author.id}`)
		.get()
		.then(doc => {
			if (doc.exists) {
				meEmbed.addField('Money', doc.data().money);
			} else {
				return;
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
		name: 'me',
		value: '```Gives personal info about yourself```',
		inline: true
	}
};
