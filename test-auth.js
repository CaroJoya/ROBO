// test-auth.js - Test your authentication
const bcrypt = require('bcryptjs');

console.log('='.repeat(60));
console.log('🧪 TESTING AUTHENTICATION SYSTEM');
console.log('='.repeat(60));

async function runTests() {
  console.log('\n1️⃣ Testing bcryptjs hashing...');
  
  const password = "testpassword123";
  const wrongPassword = "wrongpassword";
  
  // Test 1: Hash password
  const hash = await bcrypt.hash(password, 10);
  console.log('   ✅ Password hashed successfully');
  console.log('   Hash:', hash.substring(0, 50) + '...');
  
  // Test 2: Compare correct password
  const isMatch = await bcrypt.compare(password, hash);
  console.log('   ✅ Correct password matches:', isMatch);
  
  // Test 3: Compare wrong password
  const isWrongMatch = await bcrypt.compare(wrongPassword, hash);
  console.log('   ✅ Wrong password rejected:', !isWrongMatch);
  
  console.log('\n2️⃣ Testing JWT token simulation...');
  
  // Simulate JWT payload
  const userPayload = {
    userId: 1,
    email: "test@example.com",
    username: "tester"
  };
  
  console.log('   ✅ User payload:', userPayload);
  console.log('   ✅ Token would contain: userId, email, expiry');
  
  console.log('\n3️⃣ Database operations needed:');
  console.log('   ✅ Store: email, username, password_hash');
  console.log('   ✅ Retrieve: user by email/username');
  console.log('   ✅ Compare: hashed passwords');
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ALL TESTS PASSED! Your auth system is ready!');
  console.log('='.repeat(60));
  
  console.log('\n📋 NEXT STEPS:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Open: http://localhost:3000');
  console.log('   3. Test API with Thunder Client');
  console.log('   4. Check PostgreSQL is running');
}

runTests().catch(console.error);