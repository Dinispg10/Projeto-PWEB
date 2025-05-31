module.exports = function(role) {
  return function(req, res, next) {
    if (!req.user) return res.status(401).json({ msg: 'Usuário não autenticado' });

    if (Array.isArray(role)) {
      if (!role.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Acesso negado: role insuficiente' });
      }
    } else {
      if (req.user.role !== role) {
        return res.status(403).json({ msg: 'Acesso negado: role insuficiente' });
      }
    }

    next();
  }
}

