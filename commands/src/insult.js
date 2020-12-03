const { color } = require('../../storage/globals.json');

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
      .setDescription('Insult a member anonymously')
      .addField('Syntax', 'insult [member] [insult]')
      .setColor(color);

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
    value: '```replaces your insult with an anonymous message to insult specified user```',
    inline: true
  }
};
