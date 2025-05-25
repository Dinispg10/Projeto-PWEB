const mongoose = require('mongoose');

const instalacaoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dataInstalacao: { type: Date, required: true, default: Date.now },
  localizacao: {
    endereco: { type: String, required: true }
  },
  dadosTecnicos: {
    tipo: { type: String, required: true },
    potencia: { type: Number, required: true },
    numPaineis: { type: Number, required: true },
    fabricante: { type: String, required: true },
    modelo: { type: String, required: true }
  },
  status: { type: String, enum: ['pendente', 'validado', 'rejeitado'], default: 'pendente' },
  tecnicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  certificadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificado' },
  certificadoPath: { type: String }
}, {
  timestamps: true,
});


module.exports = mongoose.model('Instalacao', instalacaoSchema, 'instalacoes');


