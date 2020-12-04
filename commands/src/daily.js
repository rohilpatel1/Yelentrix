const { color } = require('../../storage/globals.json');

const addCommas = require('./helpers/commas');

function captureImage(name) {
		return `https://Hosting.rohilpatel.repl.co/${name}.jpeg`;
	};

const moment = require('moment');

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

  db.collection('users').doc(`${message.author.id}`).get().then(doc => {
    if (doc.exists) {
      if (doc.data().lastDailyReward == moment().format('L')) {
        message.channel.send('You already collected your daily reward! Check back at UTC +0!');
      } else {
        let { moneyPerDay, money  } = doc.data();

        db
        .collection('users')
        .doc(`${message.author.id}`)
        .update({
          money: money + moneyPerDay,
          lastDailyReward: moment().format('L')
        })
        .then(_ => {
          let money = doc.data().money;
          let embed = new MessageEmbed()
            .setTitle(`${message.author.username}'s Balance`)
            .setColor(color)
            .setDescription(`Congrats! You now have $${addCommas(money + moneyPerDay)}!`);

          message.channel.send(embed);
        })
        .catch(console.error);
        
      }
    } else {
      message.channel.send('You are not a member of *The Money Game*! Run `./init` to add yourself!');
      return;
    }
  });

  

};

module.exports = {
	run,
	info: {
		name: 'daily',
		value: '```Collects daily money and adds toward savings```',
    inline: true
	}
};