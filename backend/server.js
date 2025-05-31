require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const instalacoesRoutes = require('./routes/instalacoes');
const certificadosRoutes = require('./routes/certificados');
const leiturasRoutes = require('./routes/leituras');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/instalacoes', instalacoesRoutes);
app.use('/api/certificados', certificadosRoutes);
app.use('/uploads/certificados', express.static(path.join(__dirname, 'uploads/certificados')));
app.use('/api', leiturasRoutes);

mongoose.connect('mongodb://localhost:27017/users')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.listen(3000, () => console.log('Server running on port 3000'));
