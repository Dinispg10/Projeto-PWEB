const mongoose = require('mongoose');

const CertificadoSchema = new mongoose.Schema({
  tecnicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: String,
  path: String,
  dataUpload: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificado', CertificadoSchema);

