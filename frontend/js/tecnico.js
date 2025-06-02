window.onload = async () => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (!token || role !== 'tecnico') {
    alert('Precisa de fazer login como técnico para acessar esta página.');
    window.location.href = 'loginRegisto.html';
    return;
  }

  
  const username = sessionStorage.getItem('username');
  document.getElementById('mensagem').textContent = `Bem-vindo, ${username}!`;

  try {
    const res = await fetch('http://localhost:3000/api/instalacoes/pendentes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const instalacoes = await res.json();
    const lista = document.getElementById('instalacoesLista');
    lista.innerHTML = ''; 

    instalacoes.forEach(inst => {
      const li = document.createElement('li');

      const endereco = inst.localizacao?.endereco || 'N/A';
      const nomeCliente = inst.clienteId?.username || 'N/A';
      const clienteId = inst.clienteId?._id || '';

      li.innerHTML = `
        <p><strong>Endereço:</strong> ${endereco}</p>
        <p><strong>Cliente:</strong> ${nomeCliente}</p>
        <button onclick="abrirCertificado('${inst._id}', '${clienteId}', '${nomeCliente}')">Gerar Certificado</button>
        <hr>
      `;

      lista.appendChild(li);
    });

  } catch (err) {
    console.error('Erro ao buscar instalações:', err);
    alert('Erro ao carregar instalações pendentes.');
  }
};

function abrirCertificado(instalacaoId, clienteId, nomeCliente) {
  sessionStorage.setItem('instalacaoId', instalacaoId);
  sessionStorage.setItem('clienteId', clienteId);
  sessionStorage.setItem('nomeCliente', nomeCliente);
  window.location.href = 'tecnico_certificado.html';
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'loginRegisto.html';
}
