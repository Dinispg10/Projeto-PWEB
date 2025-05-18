document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;

  if (!role) {
    alert('Por favor, selecione o tipo de utilizador.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registo efetuado com sucesso! Vai para a página inicial.');
      window.location.href = 'index.html';
    } else {
      alert(data.error || 'Erro no registo');
    }
  } catch (error) {
    alert('Erro na comunicação com o servidor.');
    console.error(error);
  }
});


