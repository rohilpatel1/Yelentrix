const { color } = require('../../storage/globals.json');

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
    let insultE = new MessageEmbed()
      .setTitle('Showing help for ./insult')
      .setDescription(`
			Insult a member anonymously
			\`\`\`css\n ./insult [user] [insult] \`\`\`
			`)
      .setColor(color)
			.setFooter('Yelentrix', captureImage('yelentrix2'))
			.setTimestamp();

    message.channel.send(insultE);

    return;
  }
  const user = message.mentions.users.first();
  const mention = message.guild.member(user);

  if (!user) {
    message.channel.send('You need to mention a user!');
    return;
  }

  message
		.delete({ timeout: 500 })
		.catch(_ => {});

  message.channel
    .send(
      `<@${user.id}>, someone has a surprise for you:` +
      '```' +
      args.slice(1).join(' ') +
      '```'
    )
    .then(_ => {
      user
        .send(`There is a surprise waiting for you in **${message.guild}**!`)
        .catch(_ => {});
    })
    .catch(err => {});
};

module.exports = {
  run,
  info: {
    name: 'insult',
    value: '```Makes anonymous insult and shares anonymously```',
    inline: true
  }
};
