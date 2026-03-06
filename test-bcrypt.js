// test-bcrypt.js
const bcrypt = require('bcryptjs');

async function testBcrypt() {
  console.log("Testing bcrypt version:", require('bcrypt/package.json').version);
  
  const password = "mypassword123";
  const saltRounds = 10;
  
  // Test hashing
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hash created:", hash.substring(0, 30) + "...");
  
  // Test comparison
  const isValid = await bcrypt.compare(password, hash);
  console.log("Password matches?", isValid);
  
  const isWrong = await bcrypt.compare("wrongpassword", hash);
  console.log("Wrong password matches?", isWrong);
}

testBcrypt().catch(console.error);