const express = require('express');
const router = express.Router();
const Instalacao = require('../models/Instalacao');
const Certificado = require('../models/Certificado');
const authMiddleware = require('../middleware/authMiddleware'); 

function autenticarCliente(req, res, next) {
  if (!req.user || req.user.role !== 'cliente') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { localizacao, dadosTecnicos } = req.body;

    if (!localizacao || !localizacao.endereco || !dadosTecnicos) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta' });
    }

const novaInstalacao = new Instalacao({
  clienteId: req.user._id,
  dataInstalacao: new Date(),
  localizacao: {
    endereco: localizacao.endereco
  },
  dadosTecnicos: {
    tipo: dadosTecnicos.tipo,
    potencia: dadosTecnicos.potencia,
    numPaineis: dadosTecnicos.numPaineis,
    fabricante: dadosTecnicos.fabricante,
    modelo: dadosTecnicos.modelo
  },
  status: 'pendente'
});


    await novaInstalacao.save();

    res.status(201).json(novaInstalacao);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
router.get('/', authMiddleware, async (req, res) => {
  try {
    const clienteId = req.user._id;
    const instalacoes = await Instalacao.find({ clienteId })
      .populate('certificadoId'); 

    res.json(instalacoes);
  } catch (err) {
    console.error("ERRO AO OBTER INSTALAÇÕES:", err); 
    res.status(500).json({ error: 'Erro ao obter instalações.' });
  }
});



router.get('/pendentes', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'tecnico') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    const pendentes = await Instalacao.find({ status: 'pendente' }).populate('clienteId', 'username');

    res.json(pendentes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar instalações pendentes' });
  }
});


module.exports = router;
