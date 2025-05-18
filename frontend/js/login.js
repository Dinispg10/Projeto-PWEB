document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Obtém role da query string
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role');

  if (!role) {
    alert('Tipo de utilizador não especificado');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      // Guarda o token no sessionStorage
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('username', username);

      if (role === 'cliente') {
        window.location.href = 'cliente.html';
      } else if (role === 'tecnico') {
        window.location.href = 'tecnico.html';
      }
    } else {
      alert(data.error || 'Erro no login');
    }
  } catch (error) {
    alert('Erro ao comunicar com o servidor');
    console.error(error);
  }
});



