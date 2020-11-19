const { color } = require('../../storage/globals.json');
const { serviceAccount } = require('../../firebase/firebase');

const admin = require('firebase-admin');
/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://yelentrix.firebaseio.com"
});

*/

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

	const users = db.collection('users');

	users
		.doc(`${message.author.id}`)
		.get()
		.then(document => {
			if (document.exists) {
				message.channel.send(
					'You are not allowed to re-init your profile once it has been made!'
				);
			} else {
				users
					.doc(`${message.author.id}`)
					.set({
						userID: message.author.id,
						username: message.author.username,
						money: 0
					})
					.then(_ => {
						message.channel.send(
							'Congrats! Now you can begin playing *The Money Game*!'
						);
					})
					.catch(console.error);
			}
		});
};

module.exports = {
	run,
	info: {
		name: './init',
		value: '```Adds member as user of the money game```',
		inline: true
	}
};
