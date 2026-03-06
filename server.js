const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ========== ROUTES ==========
const authRoutes = require('./routes/auth.js');
app.use('/api/auth', authRoutes);

// ========== BASIC ROUTES ==========
app.get('/', (req, res) => {
  res.redirect('/welcome.html');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ Backend is running!', 
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🎉 Backend is working perfectly!'
  });
});

// ========== ERROR HANDLING ==========
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableRoutes: ['/', '/api/auth/signup', '/api/auth/login', '/api/health']
  });
});

app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong on the server',
    message: err.message 
  });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`✅ SERVER STARTED SUCCESSFULLY!`);
  console.log(`✅ URL: http://localhost:${PORT}`);
  console.log('='.repeat(50));
  console.log('\n📁 AVAILABLE PAGES:');
  console.log(`   🌐 Home: http://localhost:${PORT}/`);
  console.log(`   🔐 Login: http://localhost:${PORT}/login.html`);
  console.log(`   📝 Register: http://localhost:${PORT}/register.html`);
  console.log(`   🏠 Welcome: http://localhost:${PORT}/welcome.html`);
  
  console.log('\n🔧 AVAILABLE API ENDPOINTS:');
  console.log(`   📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`   🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`   👤 Signup: POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   🔑 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log('='.repeat(50));
});