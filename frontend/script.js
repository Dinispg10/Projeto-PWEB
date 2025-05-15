// Função de registo
async function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;

  const res = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert('Registo efetuado com sucesso!');
    window.location.href = 'index.html'; // Volta ao login
  } else {
    alert('Erro: ' + (data.error || 'Algo deu errado'));
  }
}

// Função de login
async function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert('Login efetuado!');
    // Aqui podes redirecionar para página privada etc
  } else {
    alert('Erro: ' + (data.error || 'Credenciais inválidas'));
  }
}

// Adicionar event listeners só se os formulários existirem
const registerForm = document.getElementById('register-form');
if (registerForm) registerForm.addEventListener('submit', registerUser);

const loginForm = document.getElementById('login-form');
if (loginForm) loginForm.addEventListener('submit', loginUser);
