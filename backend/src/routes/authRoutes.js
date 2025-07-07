const express = require('express');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const User    = require('../models/User');
const router  = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    // Let the schema pre-save hook do the hashing
    const user = new User({ name, email, password, role });
    await user.save();

    // Issue a JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Registration error:', err);
    // Mongo duplicate key on email  → 400
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  console.log('🔍 login body:', req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('⚠️ Missing email or password');
    return res.status(400).json({ message: 'Email and password required' });
  }
  const user = await User.findOne({ email });
  console.log('🔍 [login] user found:', user ? user.email : null); 
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  console.log('🔍 [login] stored hash:', user.password);
  
  const match = await bcrypt.compare(password, user.password);
  console.log('🔍 [login] password match:', match);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  console.log('✅ [login] success, issuing token for:', user.email);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;
