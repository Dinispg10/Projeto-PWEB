const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Utilizador já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'Utilizador registado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no registo' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login bem-sucedido',
    user: {
      username: user.username,
      role: user.role
    },
    token
  });
});

module.exports = router;