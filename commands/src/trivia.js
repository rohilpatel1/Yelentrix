const { color } = require('../../storage/globals.json');
const triviaQuestions = require('../../storage/trivia.json');

let item, filter, questionEmbed;

const admin = require('firebase-admin');

const db = admin.firestore();

const captureImage = require('./helpers/captureImage');

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
		let triviaEmbed = new MessageEmbed()
			.setTitle('./trivia')
			.setColor(color)
			.setDescription(`Deals trivia to anyone who wants more money
			\`\`\`css\n ./trivia [difficulty] \`\`\`
			`)
			.setFooter('Yelentrix', captureImage('yelentrix2'))
			.setTimestamp()

		message.channel.send(triviaEmbed);

		return;
	}

	switch (args[0]) {
		case 'easy':
			item = triviaQuestions.easy[Math.floor(Math.random() * triviaQuestions.easy.length)];

			filter = response => {
				return item.answers.some(answer => answer.toLowerCase() == response.content.toLowerCase());
			};

			questionEmbed = new MessageEmbed()
				.setTitle('Easy Trivia Question!')
				.setColor(color)
				.addField('Question', item.question)
				.addField('Time', '5s');

			message.channel.send(questionEmbed).then(() => {
				message.channel.awaitMessages(filter, {
					max: 1, time: 5000, errors: ['time']
				})
					.then(collected => {
						db
							.collection('users')
							.doc(`${collected.first().author.id}`)
							.get()
							.then(doc => {
								if (doc.exists) {
									let { money } = doc.data();
									db
										.collection('users')
										.doc(`${collected.first().author.id}`)
										.update({
											money: money += item.money
										})
										.then(_ => {
											let correctEmbed = new MessageEmbed()
												.setTitle('Correct!')
												.setDescription(`${collected.first().author.username}, you just earned $${item.money}!`)
												.setColor(color)

											message.channel.send(correctEmbed);
										})
										.catch(console.log)
								} else {
									message.channel.send(`${collected.first().author}, you need to actually register using ./init to actually claim the points!`)
								}
							})
							.catch(console.log);
					})
					.catch(_ => {
						let wrongEmbed = new MessageEmbed()
							.setTitle('Nobody got the correct answer!')
							.setColor(color);

						message.channel.send(wrongEmbed);
					});
			});

			break;

		case 'medium':
			item = triviaQuestions.medium[Math.floor(Math.random() * triviaQuestions.medium.length)];

			filter = response => {
				return item.answers.some(answer => answer.toLowerCase() == response.content.toLowerCase());
			};

			questionEmbed = new MessageEmbed()
				.setTitle('Medium Trivia Question!')
				.setColor(color)
				.addField('Question', item.question)
				.addField('Time', '4s');

			message.channel.send(questionEmbed).then(() => {
				message.channel.awaitMessages(filter, {
					max: 1, time: 4000, errors: ['time']
				})
					.then(collected => {
						db
							.collection('users')
							.doc(`${collected.first().author.id}`)
							.get()
							.then(doc => {
								if (doc.exists) {
									let { money } = doc.data();
									db
										.collection('users')
										.doc(`${collected.first().author.id}`)
										.update({
											money: money += item.money
										})
										.then(_ => {
											let correctEmbed = new MessageEmbed()
												.setTitle('Correct!')
												.setDescription(`${collected.first().author.username}, you just earned $${item.money}!`)
												.setColor(color)

											message.channel.send(correctEmbed);
										})
										.catch(console.log)
								} else {
									message.channel.send(`${collected.first().author}, you need to actually register using ./init to actually claim the points!`)
								}
							})
							.catch(console.log);
					})
					.catch(_ => {
						let wrongEmbed = new MessageEmbed()
							.setTitle('Nobody got the correct answer!')
							.setColor(color);

						message.channel.send(wrongEmbed);
					});
			});

			break;
		case 'hard':
			item = triviaQuestions.hard[Math.floor(Math.random() * triviaQuestions.hard.length)];
			
			filter = response => {
				return item.answers.some(answer => answer.toLowerCase() == response.content.toLowerCase());
			};

			questionEmbed = new MessageEmbed()
				.setTitle('Hard Trivia Question!')
				.setColor(color)
				.addField('Question', item.question)
				.addField('Time', '7s');

			message.channel.send(questionEmbed).then(() => {
				message.channel.awaitMessages(filter, {
					max: 1, time: 7000, errors: ['time']
				})
					.then(collected => {
						db
							.collection('users')
							.doc(`${collected.first().author.id}`)
							.get()
							.then(doc => {
								if (doc.exists) {
									let { money } = doc.data();
									db
										.collection('users')
										.doc(`${collected.first().author.id}`)
										.update({
											money: money += item.money
										})
										.then(_ => {
											let correctEmbed = new MessageEmbed()
												.setTitle('Correct!')
												.setDescription(`${collected.first().author.username}, you just earned $${item.money}!`)
												.setColor(color)

											message.channel.send(correctEmbed);
										})
										.catch(console.log)
								} else {
									message.channel.send(`${collected.first().author}, you need to actually register using ./init to actually claim the points!`)
								}
							})
							.catch(console.log);
					})
					.catch(_ => {
						let wrongEmbed = new MessageEmbed()
							.setTitle('Nobody got the correct answer!')
							.setColor(color);

						message.channel.send(wrongEmbed);
					});
			});

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