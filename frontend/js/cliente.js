document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');


  if (!token || role !== 'cliente') {
    alert('Acesso negado. Faça login como cliente.');
    window.location.href = 'loginRegisto.html';
    return;
  }

  const username = sessionStorage.getItem('username');
  document.getElementById('mensagem').textContent = `Bem-vindo, ${username}!`;

  const btn = document.getElementById('btnInstalacao');
  btn.addEventListener('click', () => {
    window.location.href = 'cliente_instalacao.html';
  });

  fetchInstalacoes();
  fetchLeituras();
});

async function fetchInstalacoes() {
  const token = sessionStorage.getItem('token');
  const container = document.getElementById('instalacoesContainer');
  container.innerHTML = '<p>A carregar instalações...</p>';

  try {
    const response = await fetch('http://localhost:3000/api/instalacoes', {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });

    const data = await response.json();

    if (!response.ok) {
      container.innerHTML = `<p>Erro: ${data.error || 'Não foi possível obter as instalações.'}</p>`;
      return;
    }

    if (data.length === 0) {
      container.innerHTML = '<p>Não tem instalações registadas ainda.</p>';
      return;
    }

    container.innerHTML = '';
    data.forEach(instalacao => {
      const div = document.createElement('div');
      div.classList.add('instalacao');

      div.innerHTML = `
        <p><strong>Endereço:</strong> ${instalacao.localizacao.endereco}</p>
        <p><strong>Potência:</strong> ${instalacao.dadosTecnicos.potencia} kW</p>
        <p><strong>Tipo:</strong> ${instalacao.dadosTecnicos.tipo}</p>
        <p><strong>Status:</strong> ${instalacao.status}</p>
      `;

      if (instalacao.certificadoId && instalacao.certificadoId.path) {
        const link = document.createElement('a');
        link.href = `http://localhost:3000${instalacao.certificadoId.path}`;  
        link.textContent = 'Download do Certificado';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        div.appendChild(link);
      } else {
        const p = document.createElement('p');
        p.textContent = 'Certificado ainda não disponível.';
        div.appendChild(p);
      }


      div.appendChild(document.createElement('hr'));
      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Erro ao carregar instalações.</p>';
  }
}

async function fetchLeituras() {
  const token = sessionStorage.getItem('token');
  const clienteId = sessionStorage.getItem('userId'); 
  const container = document.getElementById('leiturasContainer');
  container.innerHTML = '<p>A carregar leituras...</p>';

  try {
    const response = await fetch(`http://localhost:3000/api/leituras/${clienteId}`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Erro ao carregar leituras');
    }

    const leituras = await response.json();

    if (leituras.length === 0) {
      container.innerHTML = '<p>Não foram encontradas leituras.</p>';
      return;
    }

    container.innerHTML = '';
    leituras.forEach(l => {
      const div = document.createElement('div');
      div.classList.add('leitura');
      div.innerHTML = `
        <p><strong>Data:</strong> ${new Date(l.data).toLocaleString()}</p>
        <p><strong>Produção:</strong> ${l.producao} kWh</p>
        <p><strong>Gastos:</strong> ${l.gastos} kWh</p>
        <p><strong>Créditos:</strong> ${l.creditos}</p>
        <hr>
      `;
      container.appendChild(div);
    });

  } catch (error) {
    console.error('Erro ao carregar leituras:', error);
    container.innerHTML = `<p>Erro ao carregar leituras: ${error.message}</p>`;
  }
}


function logout() {
  sessionStorage.clear();
  window.location.href = 'loginRegisto.html';
}
