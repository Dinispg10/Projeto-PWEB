const mongoose = require('mongoose');

const leituraSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  producao: { type: Number, required: true },
  gastos: { type: Number, required: true },
  creditos: { type: Number, required: true },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leitura', leituraSchema);
