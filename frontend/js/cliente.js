document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (!token || role !== 'cliente') {
    alert('Acesso negado. Faça login como cliente.');
    window.location.href = 'index.html';
    return;
  }

  // Exemplo de ação: mostrar mensagem
  const username = sessionStorage.getItem('username');
  document.getElementById('mensagem').textContent = `Bem-vindo, ${username}!`;
});

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}


