const express = require('express');
const router = express.Router();

// Dummy admin user (you can replace this with DB later)
const dummyUser = {
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Match dummy credentials
  if (email === dummyUser.email && password === dummyUser.password) {
    return res.json({
      token: 'fake-jwt-token',
      user: {
        email: dummyUser.email,
        role: dummyUser.role
      }
    });
  }

  // If credentials don't match
  res.status(401).json({ message: 'Invalid email or password' });
});

module.exports = router;
