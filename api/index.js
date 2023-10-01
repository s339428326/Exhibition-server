const dotenv = require('dotenv');

const app = require('../src/app');
const mongoDB = require('../src/mongoDB');

dotenv.config({ path: 'config.env' });

const port = process.env.port || 8080;

mongoDB();

app.listen(port, () =>
  console.log(
    `NODE_ENV=${
      process.env.NODE_ENV
    }\nApplication Start Port:${port}\n前端主機位置抓取：${
      process.env.NODE_ENV === 'production'
        ? process.env?.FRONT_END_SERVER
        : process.env?.FRONT_END_LOCAL
    }`
  )
);

module.exports = app;
