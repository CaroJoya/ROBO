// robust-server.js - WON'T CRASH
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ========== IN-MEMORY DATABASE ==========
const users = [];
let userIdCounter = 1;

console.log('💡 Using in-memory database (no PostgreSQL needed)');

// ========== AUTH ROUTES ==========
app.post('/api/auth/signup', async (req, res) => {
  console.log('📝 Signup:', req.body);
  
  try {
    const { email, username, password, confirmPassword } = req.body;
    
    // Validation
    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields required' 
      });
    }
    
    if (!email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password too short (min 6)' 
      });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Passwords do not match' 
      });
    }
    
    // Check existing
    const exists = users.find(u => u.email === email || u.username === username);
    if (exists) {
      return res.status(409).json({ 
        success: false, 
        error: 'Email/username taken' 
      });
    }
    
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: userIdCounter++,
      email,
      username,
      passwordHash: hash,
      createdAt: new Date()
    };
    
    users.push(user);
    
    // Create token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: '🎉 User created!',
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token,
      note: 'Using in-memory storage'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('🔑 Login:', req.body);
  
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Credentials required' 
      });
    }
    
    // Find user
    const user = users.find(u => 
      u.email === identifier || u.username === identifier
    );
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    // Check password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    // Create token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: '✅ Login successful!',
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// ========== OTHER ROUTES ==========
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ Server is running!',
    database: 'In-memory (no PostgreSQL needed)',
    usersCount: users.length,
    time: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: '🎉 Everything works!',
    endpoints: [
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/health'
    ]
  });
});

app.get('/', (req, res) => {
  res.redirect('/welcome.html');
});

// ========== ERROR HANDLING ==========
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Something went wrong',
    message: err.message 
  });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 ROBUST SERVER STARTED!');
  console.log(`✅ URL: http://localhost:${PORT}`);
  console.log('💡 No PostgreSQL needed - using in-memory storage');
  console.log('='.repeat(50));
  console.log('\n📝 Test these:');
  console.log(`   1. Open: http://localhost:${PORT}`);
  console.log(`   2. Register: http://localhost:${PORT}/register.html`);
  console.log(`   3. API Health: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
  console.log('\n⚠️  NOTE: Users reset when server restarts');
  console.log('     To persist data, fix PostgreSQL connection');
  console.log('='.repeat(50));
});