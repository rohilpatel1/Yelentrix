const app = require('express')();

app.get('/', (_, res) => {
  res.end('Bot is alive and healthy!');
});

let server = app.listen(3000, _ => console.log('Listening on port 3000'));

module.exports = server;