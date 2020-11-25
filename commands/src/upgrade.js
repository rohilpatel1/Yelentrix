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

	if (!args[0]) {
		const upgradePreview = new MessageEmbed()
			.setTitle('Personal Upgrade Plans')
			.setColor(color);

		db.collection('users')
			.doc(`${message.author.id}`)
			.get()
			.then(doc => {
				if (doc.exists) {
					let { moneyNeededToDouble, money } = doc.data();
					
					if (money >= moneyNeededToDouble) {
					  upgradePreview.setDescription(`You have $${money}. To upgrade your daily paycheck, you can spend $${moneyNeededToDouble} by entering the command ` + '`./upgrade confirm`' + '!');
					} else {
					  upgradePreview.setDescription(`You have $${money}, and to upgrade your daily paycheck, you must have $${moneyNeededToDouble}`);
					}
					
				} else {
					upgradePreview.setDescription(
						'You are not a member of *The Money Game*! Run `./init` to add yourself!'
					);
				}
				
				message.channel.send(upgradePreview);
			})
      .catch(console.error);
			
			return;
	}
	
	if (args[0] == 'confirm') {
    db
      .collection('users')
      .doc(`${message.author.id}`)
      .get()
      .then(doc => {
        let { moneyNeededToDouble, money, moneyPerDay } = doc.data();

        if (moneyNeededToDouble > money) {
          message.channel.send("You don't have the funds necessary to uprade your paycheck. Enter `./upgrade` for more details.");

          return;
        } else {
          db
            .collection('users')
            .doc(`${message.author.id}`)
            .update({
              moneyNeededToDouble: moneyNeededToDouble * 2,
              money: money - moneyNeededToDouble,
              moneyPerDay: moneyPerDay * 2
            })
            .then(_ => {
              message.channel.send(`Congrats! Each day, you now earn $${moneyPerDay * 2}! `)
            })
            .catch(console.error)
        }
      })
      .catch(console.error)
  }
};

module.exports = {
	run,
	info: {
		name: 'upgrade',
		value: '```upgrade daily paycheck amount```',
		inline: true
	}
};
