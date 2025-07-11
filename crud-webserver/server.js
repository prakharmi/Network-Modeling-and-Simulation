const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`\n🌐 [${timestamp}] ${method} ${url}`);
  console.log(`   User-Agent: ${userAgent.substring(0, 50)}...`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body: ${JSON.stringify(req.body)}`);
  }
  
  // Log response when it's finished
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`   Response: ${res.statusCode} ${res.statusMessage}`);
    if (body && typeof body === 'string' && body.length < 200) {
      console.log(`   Data: ${body}`);
    }
    console.log(`   ✅ Request completed\n`);
    return originalSend.call(this, body);
  };
  
  next();
});

// In-memory storage
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

let sessions = {}; // Store active sessions

// Session middleware
const requireSession = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  req.session = sessions[sessionId];
  next();
};

// Routes

// Create session (login)
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    console.log(`   ❌ LOGIN FAILED: Username required`);
    return res.status(400).json({ error: 'Username required' });
  }
  
  const sessionId = uuidv4();
  sessions[sessionId] = {
    id: sessionId,
    username: username,
    createdAt: new Date().toISOString()
  };
  
  res.cookie('sessionId', sessionId, { 
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  console.log(`   ✅ LOGIN SUCCESS: User '${username}' logged in with session ${sessionId}`);
  res.json({ message: 'Login successful', sessionId });
});

// Logout
app.post('/api/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  
  if (sessionId && sessions[sessionId]) {
    const username = sessions[sessionId].username;
    delete sessions[sessionId];
    console.log(`   ✅ LOGOUT SUCCESS: User '${username}' logged out`);
  }
  
  res.clearCookie('sessionId');
  res.json({ message: 'Logout successful' });
});

// Get session info
app.get('/api/session', requireSession, (req, res) => {
  res.json(req.session);
});

// CRUD Operations for Users

// CREATE - Add new user
app.post('/api/users', requireSession, (req, res) => {
  const { name, email, age } = req.body;
  
  if (!name || !email || !age) {
    console.log(`   ❌ CREATE FAILED: Missing required fields`);
    return res.status(400).json({ error: 'Name, email, and age are required' });
  }
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    age: parseInt(age)
  };
  
  users.push(newUser);
  console.log(`   ✅ CREATE SUCCESS: User '${name}' created with ID ${newUser.id}`);
  res.status(201).json(newUser);
});

// READ - Get all users
app.get('/api/users', requireSession, (req, res) => {
  console.log(`   ✅ READ SUCCESS: Retrieved ${users.length} users`);
  res.json(users);
});

// READ - Get user by ID
app.get('/api/users/:id', requireSession, (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    console.log(`   ❌ READ FAILED: User with ID ${id} not found`);
    return res.status(404).json({ error: 'User not found' });
  }
  
  console.log(`   ✅ READ SUCCESS: Retrieved user '${user.name}' (ID: ${id})`);
  res.json(user);
});

// UPDATE - Update user
app.put('/api/users/:id', requireSession, (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, age } = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    console.log(`   ❌ UPDATE FAILED: User with ID ${id} not found`);
    return res.status(404).json({ error: 'User not found' });
  }
  
  const oldUser = { ...users[userIndex] };
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (age) users[userIndex].age = parseInt(age);
  
  console.log(`   ✅ UPDATE SUCCESS: User ID ${id} updated`);
  console.log(`      Old: ${JSON.stringify(oldUser)}`);
  console.log(`      New: ${JSON.stringify(users[userIndex])}`);
  
  res.json(users[userIndex]);
});

// DELETE - Delete user
app.delete('/api/users/:id', requireSession, (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    console.log(`   ❌ DELETE FAILED: User with ID ${id} not found`);
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  console.log(`   ✅ DELETE SUCCESS: User '${deletedUser.name}' (ID: ${id}) deleted`);
  res.json(deletedUser);
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📋 Features implemented:');
  console.log('   - RESTful API with CRUD operations');
  console.log('   - Cookie-based session handling');
  console.log('   - Session authentication middleware');
  console.log('   - Request logging for demonstration');
  console.log('   - Simple web UI for testing');
  console.log('\n🔍 Watch the console for real-time request logs!\n');
});

module.exports = app;