const dotenv = require('dotenv');

const { ImgurClient } = require('imgur');

dotenv.config({ path: 'config.env' });

exports.client = new ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  refreshToken: process.env.IMGUR_REFRESH_TOKEN,
});
