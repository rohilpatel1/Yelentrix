const { color } = require('../../storage/globals.json');
const { serviceAccount } = require('../../firebase/firebase');
const admin = require('firebase-admin');
const moment = require('moment');

const db = admin.firestore();

const captureImage = require('./helpers/captureImage');

const run = async (message, args, MessageEmbed, _, args2, DMChannel) => {
  if (message.channel instanceof DMChannel) {
    return message.channel
      .send('Commands for this bot may not be used inside of a Direct Messages!')
      .catch(console.error);
  }

  const users = db.collection('users');

  const doc = await users.doc(`${message.author.id}`).get().catch(console.log)

	if (doc.exists) {
		message.channel.send('You are not allowed to re-init your profile once it has been made!');
	} else {
		let res = await users.doc(`${message.author.id}`).set({
			userID: message.author.id,
			username: message.author.username,
			money: 1,
			lastDailyReward: moment().format('L'),
			moneyPerDay: 1,
			moneyNeededToDouble: 2
		});

		if (!res) {
			return message.channel.send('An error occured. Please try again later!')
		}
			
		message.channel.send('Congrats! Now you can begin playing *The Money Game*!');
	}
};

module.exports = {
  run,
  info: {
    name: 'init',
    value: '```Adds member as user of the money game```',
    inline: true
  }
};