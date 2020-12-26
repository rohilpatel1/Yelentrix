const { color } = require('../../storage/globals.json');

const captureImage = require('./helpers/captureImage');

const run = async(message, args, MessageEmbed, _, args2, DMChannel) => {
  if (message.channel instanceof DMChannel) {
    return message.channel
      .send('Commands for this bot may not be used inside of a Direct Messages!')
      .catch(console.error);
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

    return message.channel.send(insultE);
  }

  const user = message.mentions.users.first();
  const mention = message.guild.member(user);

  if (!user) return message.channel.send('You need to mention a user!');

	if (!args[1]) return message.channel.send('You need to send a message!');

  message.delete({ timeout: 500 }).catch(_ => {});

  let res = await message.channel.send(`<@${user.id}>, someone has a surprise for you: \n\n Reveal It Here → ||${args.slice(1).join(' ')}||`).catch(err => {});

	if (!res) {
		return message.channel.send('An error has occured! Please try again later.')
	}

	user.send(`There is a surprise waiting for you in **${message.guild}**!`).catch(_ => {});
};

module.exports = {
  run,
  info: {
    name: 'insult',
    value: '```Makes anonymous insult and shares anonymously```',
    inline: true
  }
};