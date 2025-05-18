document.getElementById('btnCliente').addEventListener('click', () => {
  window.location.href = 'login.html?role=cliente';
});

document.getElementById('btnTecnico').addEventListener('click', () => {
  window.location.href = 'login.html?role=tecnico';
});

document.getElementById('btnRegisto').addEventListener('click', () => {
  window.location.href = 'registo.html';
});

