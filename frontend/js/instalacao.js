window.onload = () => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (!token || role !== 'cliente') {
    alert('Precisa de fazer login como cliente para acessar esta página.');
    window.location.href = 'loginRegisto.html';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('token');
  const form = document.getElementById('instalacaoForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const endereco = document.getElementById('localizacao').value.trim();
    const tipo = document.getElementById('tipo').value;
    const potencia = parseFloat(document.getElementById('potencia').value);
    const numPaineis = parseInt(document.getElementById('numPaineis').value, 10);
    const fabricante = document.getElementById('fabricante').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const dataInstalacao = new Date().toISOString();

    if (!endereco || !tipo || isNaN(potencia)) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/instalacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          dataInstalacao,
          localizacao: {
            endereco,
          },

          dadosTecnicos: {
            tipo,
            potencia,
            numPaineis,
            fabricante,
            modelo,
          }
        }),
      });

      const text = await response.text();
      console.log('Resposta do servidor:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        result = { error: 'Resposta inválida do servidor.' };
      }

      if (response.ok) {
        document.getElementById('msg').textContent = 'Instalação registada com sucesso!';
        form.reset();
      } else {
        document.getElementById('msg').textContent = result.error || 'Erro ao registar instalação.';
      }
    } catch (err) {
      console.error('Erro de rede:', err);
      alert('Erro ao comunicar com o servidor.');
    }
  });
});

function paginainicial() {
  window.location.href = 'cliente.html';
}

