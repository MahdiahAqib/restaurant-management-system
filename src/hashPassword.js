// hashPassword.js

const bcrypt = require('bcryptjs'); // Use require instead of import

async function run() {
  const password = '123'; // Replace with the plain password you want to hash
  const saltRounds = 12; // You can adjust the number of salt rounds for strength
  
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  console.log('Hashed Password:', hashedPassword);
}

run();
