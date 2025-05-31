const express = require('express');
const router = express.Router(); 
const Leitura = require('../models/Leitura');
const Cliente = require('../models/User'); 
const Instalacao = require('../models/Instalacao');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');


// Gerar leitura mock com créditos acumulativos
router.post('/leituras/mock', authMiddleware, checkRole('gestorOperacoes'), async (req, res) => {
  try {
    const { clienteId } = req.body;
    if (!clienteId) return res.status(400).json({ msg: 'ClienteId é obrigatório' });

    // Chamar API mock para obter produção e consumo
    const response = await fetch(`http://localhost:3001/mock-data/${clienteId}`);
    if (!response.ok) throw new Error('Erro ao chamar API mock');
    const data = await response.json();

    const producao = data.producao;
    const gastos = data.consumo;

    // Buscar última leitura para obter créditos acumulados
    const ultimaLeitura = await Leitura.findOne({ cliente: clienteId }).sort({ data: -1 });
    const creditosAnteriores = ultimaLeitura ? ultimaLeitura.creditos : 0;

    // Calcular saldo atual e novos créditos acumulados
    const saldoAtual = producao - gastos;
    const creditosAtualizados = +(Math.max(creditosAnteriores + saldoAtual, 0)).toFixed(2);


    const leitura = new Leitura({
      cliente: clienteId,
      producao,
      gastos,
      creditos: creditosAtualizados,
      data: new Date()
    });

    await leitura.save();

    return res.status(201).json({ msg: 'Leitura mock salva com sucesso', leitura });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Erro interno no servidor' });
  }
});

// Listar todas as leituras de um cliente (com validação de acesso)
router.get('/leituras/:clienteId', authMiddleware, checkRole(['gestorOperacoes', 'cliente']), async (req, res) => {
  try {
    const clienteIdParam = req.params.clienteId;
    const user = req.user;

    if (!clienteIdParam) return res.status(400).json({ msg: 'ClienteId é obrigatório' });

    if (user.role === 'cliente' && (!user._id || user._id.toString() !== clienteIdParam.toString())) {
      return res.status(403).json({ msg: 'Acesso negado: role insuficiente' });
    }

    const leituras = await Leitura.find({ cliente: clienteIdParam }).sort({ data: -1 });
    return res.json(leituras);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Erro interno no servidor' });
  }
});

// Buscar clientes com instalação validada
router.get('/clientes/instalacoes-validadas', authMiddleware, checkRole('gestorOperacoes'), async (req, res) => {
  try {
    const instalacoesValidadas = await Instalacao.find({ status: 'validado' }).select('clienteId');
    const clienteIds = [...new Set(instalacoesValidadas.map(i => i.clienteId.toString()))];
    const clientes = await Cliente.find({ _id: { $in: clienteIds } }).select('_id username');

    res.json(clientes);
  } catch (err) {
    console.error('Erro ao buscar clientes com instalação validada:', err);
    res.status(500).json({ msg: 'Erro ao buscar clientes com instalação validada' });
  }
});

module.exports = router;
