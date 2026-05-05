const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const jwtSecret = process.env.JWT_SECRET || 'eira_secret_2026';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign(
      { user: 'admin', role: 'admin' },
      jwtSecret,
      { expiresIn: '1d' }
    );

    res.json({ 
      success: true, 
      token: token,
      message: 'Logged in successfully' 
    });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

module.exports = router;
