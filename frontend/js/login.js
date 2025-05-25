document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('Resposta do servidor:', data);

    if (response.ok) {
      const token = data.token;
      const role = data.user.role;
      const username = data.user.username;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('username', username);

      if (role === 'cliente') {
        window.location.href = 'cliente.html';
      } else if (role === 'tecnico') {
        window.location.href = 'tecnico.html';
      } else {
        alert('Tipo de utilizador desconhecido: ' + role);
      }
    } else {
      alert(data.message || 'Erro no login');
    }
  } catch (error) {
    console.error('Erro ao comunicar com o servidor:', error);
    alert('Erro ao comunicar com o servidor. Verifique se o servidor está ativo.');
  }
});
