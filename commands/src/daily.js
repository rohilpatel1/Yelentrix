const { color } = require('../../storage/globals.json');

const addCommas = require('./helpers/commas');

const captureImage = require('./helpers/captureImage');

const moment = require('moment');

const admin = require('firebase-admin');
const db = admin.firestore();

const run = async(message, args, MessageEmbed, _, args2, DMChannel) => {
  if (message.channel instanceof DMChannel) {
	  return message.channel.send('Commands for this bot may not be used inside of a Direct Messages!')
			.catch(console.error);
	}

  const doc = await db.collection('users').doc(`${message.author.id}`).get().catch(console.log);

	if (doc.exists) {
		if (doc.data().lastDailyReward == moment().format('L')) {
			let alreadyGotDailyReward = new MessageEmbed()
			.setTitle('Uh Oh!')
			.setColor(color)
			.setDescription('It appears you already collected your daily reward for today! Check back at 7pm Eastern Time!');

			message.channel.send(alreadyGotDailyReward);
		} else {
			let { moneyPerDay, money  } = doc.data();

			let res = await db.collection('users').doc(`${message.author.id}`).update({
				money: money + moneyPerDay,
				lastDailyReward: moment().format('L')
			});

			if (!res) {
				return message.channel.send('An error has occured. Check back at another time.')
			}

			let embed = new MessageEmbed()
				.setTitle(`Daily Reward`)
				.setColor(color)
				.setDescription(`Congrats! You now have $${addCommas(money + moneyPerDay)}!`)
				.setFooter('Yelentrix', captureImage('yelentrix2'))
				.setTimestamp();

			message.channel.send(embed);
		}
	} else {
		return message.channel.send('You are not a member of *The Money Game*! Run `./init` to add yourself!');
	}
};

module.exports = {
	run,
	info: {
		name: 'daily',
		value: '```Collects daily money and adds toward savings```',
    inline: true
	}
};