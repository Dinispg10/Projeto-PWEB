const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Modelo mongoose do utilizador
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verifica se já existe o username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username já existe' });
    }

    // Cria e guarda o novo utilizador
    const newUser = new User({ username, password, role });
    await newUser.save();

    res.status(201).json({ message: 'Utilizador registado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  // procura utilizador no MongoDB
  const user = await User.findOne({ username, role });

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // verifica password (ajusta conforme usas hash ou texto simples)
  if (user.password !== password) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // gera token JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // envia resposta com token
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