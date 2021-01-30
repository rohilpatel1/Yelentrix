const { color } = require('../../storage/globals.json');
const triviaQuestions = require('../../storage/trivia.json');

const admin = require('firebase-admin');

const db = admin.firestore();

const captureImage = require('./helpers/captureImage');

const run = async (message, args, MessageEmbed, _, args2, DMChannel) => {
	if (message.channel instanceof DMChannel) {
		return message.channel
			.send('Commands for this bot may not be used inside of a Direct Messages!')
			.catch(console.error);
	}

	if (!args[0]) {
		let triviaEmbed = new MessageEmbed()
			.setTitle('./trivia')
			.setColor(color)
			.setDescription(`Deals trivia to anyone who wants more money
			\`\`\`css\n ./trivia [difficulty] \`\`\`
			`)

		return message.channel.send(triviaEmbed);
	}

	switch (args[0]) {
		case 'easy': {
			const item = triviaQuestions.easy[Math.floor(Math.random() * triviaQuestions.easy.length)];

			const filter = response => {
				return item.answers.some(answer => answer.toLowerCase() == response.content.toLowerCase());
			};

			const questionEmbed = new MessageEmbed()
				.setTitle('Easy Trivia Question!')
				.setColor(color)
				.addField('Question', item.question)
				.addField('Time', '5s');

			await message.channel.send(questionEmbed);

			let collected = await message.channel.awaitMessages(filter, {
				max: 1, time: 5000, errors: ['time']
			})
			.catch(_ => {
				let wrongEmbed = new MessageEmbed()
					.setTitle('Nobody got the correct answer!')
					.setColor(color);
				message.channel.send(wrongEmbed);
			});

			if (!collected) return;

			const doc = await db.collection('users').doc(`${collected.first().author.id}`).get();
							
			if (doc.exists) {
				let { money } = doc.data();
				let res = await db.collection('users').doc(`${collected.first().author.id}`).update({
					money: money += item.money
				}).catch(console.log)

				if (!res) {
					return message.channel.send('An error occured. Please try again later');
				}
					
				let correctEmbed = new MessageEmbed()
					.setTitle('Correct!')
					.setDescription(`${collected.first().author.username}, you just earned $${item.money}!`)
					.setColor(color)

				message.channel.send(correctEmbed);
			} else {
				message.channel.send(`${collected.first().author}, you need to actually register using ./init to actually claim the points!`)
			}
			break;
		}

		case 'medium': {
			let item = triviaQuestions.medium[Math.floor(Math.random() * triviaQuestions.medium.length)];

			let filter = response => {
				return item.answers.some(answer => answer.toLowerCase() == response.content.toLowerCase());
			};

			let questionEmbed = new MessageEmbed()
				.setTitle('Medium Trivia Question!')
				.setColor(color)
				.addField('Question', item.question)
				.addField('Time', '4s');

			await message.channel.send(questionEmbed);

			const collected = await message.channel.awaitMessages(filter, {
				max: 1, time: 4000, errors: ['time']
			}).catch(_ => {
				let wrongEmbed = new MessageEmbed()
					.setTitle('Nobody got the correct answer!')
					.setColor(color);

				message.channel.send(wrongEmbed);
			});

			if (!collected) return;

			const doc = await db.collection('users').doc(`${collected.first().author.id}`).get();

			if (doc.exists) {
				let { money } = doc.data();
				let res = await db.collection('users').doc(`${collected.first().author.id}`)
					.update({
						money: money += item.money
					}).catch(console.log)

					if (!res) return message.channel.send('An error occured. Please try again later!');

					let correctEmbed = new MessageEmbed()
						.setTitle('Correct!')
						.setDescription(`${collected.first().author.username}, you just earned $${item.money}!`)
						.setColor(color)

					message.channel.send(correctEmbed);
			} else {
				message.channel.send(`${collected.first().author}, you need to actually register using ./init to actually claim the points!`)
			}		
		}

			break;
		case 'hard': {
			let item = triviaQuestions.hard[Math.floor(Math.random() * triviaQuestions.hard.length)];
			
			let filter = response => {
				return item.answers.some(answer => answer.toLowerCase() == response.content.toLowerCase());
			};

			let questionEmbed = new MessageEmbed()
				.setTitle('Hard Trivia Question!')
				.setColor(color)
				.addField('Question', item.question)
				.addField('Time', '7s');

			await message.channel.send(questionEmbed);

			const collected = await message.channel.awaitMessages(filter, {
				max: 1, time: 7000, errors: ['time']
			}).catch(_ => {
					let wrongEmbed = new MessageEmbed()
						.setTitle('Nobody got the correct answer!')
						.setColor(color);

					message.channel.send(wrongEmbed);
				});

			if (!collected) return;

			const doc = await db.collection('users').doc(`${collected.first().author.id}`).get().catch(console.log);

			if (doc.exists) {
				let { money } = doc.data();
				let res = await db.collection('users').doc(`${collected.first().author.id}`).update({
					money: money += item.money
				}).catch(console.log)

				if (!res) return message.channel.send('An error occured. Please try again later!');

				let correctEmbed = new MessageEmbed()
					.setTitle('Correct!')
					.setDescription(`${collected.first().author.username}, you just earned $${item.money}!`)
					.setColor(color)

				message.channel.send(correctEmbed);
					
			} else {
				message.channel.send(`${collected.first().author}, you need to actually register using ./init to actually claim the points!`)
			}
		}
			break;
		default:
			message.channel.send('That level of trivia does not exist!')
			break;
	}
};

module.exports = {
	run,
	info: {
		name: 'trivia',
		value: '```Earn quick money by answering questions```',
		inline: true
	}
};