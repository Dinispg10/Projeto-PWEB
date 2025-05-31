// mockServer.js
const express = require('express');
const app = express();

app.get('/mock-data/:idClient', (req, res) => {
  const producao = Math.floor(Math.random() * 100);
  const consumo = Math.floor(Math.random() * 100);
  res.json({ producao, consumo });
});

app.listen(3001, () => {
  console.log('Mock API rodando na porta 3001');
});
