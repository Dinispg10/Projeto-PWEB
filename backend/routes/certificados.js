const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Instalacao = require('../models/Instalacao');
const Certificado = require('../models/Certificado');  
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();



const uploadPath = path.join(__dirname, '../uploads/certificados');
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    cb(null, `cert_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/:id', authMiddleware, upload.single('certificado'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Nenhum arquivo enviado.' });
    }

    const instalacao = await Instalacao.findById(req.params.id);
    if (!instalacao) return res.status(404).json({ msg: 'Instalação não encontrada' });


    const certificado = new Certificado({
      tecnicoId: req.user._id,
      clienteId: instalacao.clienteId,
      filename: req.file.filename,
      path: `/uploads/certificados/${req.file.filename}`
    });

    await certificado.save();

 
    instalacao.status = 'validado';
    instalacao.certificadoId = certificado._id;
    instalacao.tecnicoId = req.user._id;

    await instalacao.save();

    res.json({ msg: 'Certificado enviado e instalação validada com sucesso!' });
  } catch (err) {
    console.error('Erro no upload do certificado:', err);
    res.status(500).json({ msg: 'Erro ao enviar certificado.' });
  }
});

module.exports = router;
