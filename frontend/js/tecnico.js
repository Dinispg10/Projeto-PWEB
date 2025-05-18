document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (!token || role !== 'tecnico') {
    alert('Acesso negado. Faça login como técnico.');
    window.location.href = 'index.html';
    return;
  }

  const username = sessionStorage.getItem('username');
  document.getElementById('mensagem').textContent = `Bem-vindo, ${username}!`;
});

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}


