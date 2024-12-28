const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

console.log('Jest setup loaded with environment variables:');
console.log('APP_NAME:', process.env.APP_NAME);
console.log('MONGODB_URL:', process.env.MONGODB_URL);