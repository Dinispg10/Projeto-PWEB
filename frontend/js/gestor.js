const token = sessionStorage.getItem('token');
const role = sessionStorage.getItem('role');

if (!token || role !== 'gestorOperacoes') {
  alert('Precisa fazer login como Gestor de Operações para acessar esta página.');
  window.location.href = 'loginRegisto.html';
  throw new Error('Acesso negado: usuário não autorizado');
}

 const username = sessionStorage.getItem('username');
  document.getElementById('mensagem').textContent = `Bem-vindo, ${username}!`;

const clientesSelect = document.getElementById('clientesSelect');
const btnGerarLeitura = document.getElementById('btnGerarLeitura');
const leiturasLista = document.getElementById('leiturasLista');

let clienteSelecionado = '';

async function carregarClientes() {
  try {
    const res = await fetch('http://localhost:3000/api/clientes/instalacoes-validadas', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Erro ao carregar clientes');
    const clientes = await res.json();

    clientesSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    clientes.forEach(c => {
      const option = document.createElement('option');
      option.value = c._id;
      option.textContent = c.username;
      clientesSelect.appendChild(option);
    });
  } catch (e) {
    clientesSelect.innerHTML = '<option>Erro ao carregar clientes</option>';
    console.error(e);
  }
}

clientesSelect.addEventListener('change', () => {
  clienteSelecionado = clientesSelect.value;
  btnGerarLeitura.disabled = !clienteSelecionado;
  if (clienteSelecionado) {
    carregarLeituras(clienteSelecionado);
  } else {
    leiturasLista.textContent = 'Selecione um cliente para ver as leituras.';
  }
});

async function carregarLeituras(clienteId) {
  try {
    const res = await fetch(`http://localhost:3000/api/leituras/${clienteId}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Erro ao carregar leituras');

    const leituras = await res.json();

    if (leituras.length === 0) {
      leiturasLista.textContent = 'Nenhuma leitura encontrada.';
      return;
    }

  leiturasLista.innerHTML = leituras.map(l => {
  const creditoClass = l.creditos > 0 ? 'positivo' : 'zero';
  return `
    <div class="leitura-card ${creditoClass}">
      <div><strong>Data:</strong> ${new Date(l.data).toLocaleString()}</div>
      <div><strong>Produção:</strong> ${l.producao} kWh</div>
      <div><strong>Gastos:</strong> ${l.gastos} kWh</div>
      <div><strong>Créditos:</strong> ${l.creditos > 0 ? l.creditos : 0} kWh</div>
    </div>
  `;
}).join('');

  } catch (error) {
    leiturasLista.textContent = 'Erro ao carregar leituras.';
    console.error(error);
  }
}

async function gerarLeituraMock() {
  if (!clienteSelecionado) {
    alert('Selecione um cliente primeiro.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/leituras/mock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ clienteId: clienteSelecionado })
    });

    if (!res.ok) throw new Error('Erro ao gerar leitura mock');

    await carregarLeituras(clienteSelecionado);
  } catch (error) {
    alert('Erro ao gerar leitura mock.');
    console.error(error);
  }
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'loginRegisto.html';
}

carregarClientes();
