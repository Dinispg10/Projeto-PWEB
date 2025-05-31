window.onload = () => {
  const instalacaoId = sessionStorage.getItem('instalacaoId');
  const clienteId = sessionStorage.getItem('clienteId');
  const nomeCliente = sessionStorage.getItem('nomeCliente');

  if (!instalacaoId || !clienteId || !nomeCliente) {
     alert('Precisa de fazer login como técnico para acessar esta página.');
    window.location.href = 'loginRegisto.html';
    return;
  }

  document.getElementById('instalacaoId').value = instalacaoId;
  document.getElementById('userId').value = clienteId;
  document.getElementById('nomeCliente').value = nomeCliente;
};

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = sessionStorage.getItem('token');
  const instalacaoId = document.getElementById('instalacaoId').value;
  const fileInput = document.getElementById('certificado');
  const file = fileInput.files[0];

  if (!file) {
    alert('Por favor, selecione um arquivo PDF.');
    return;
  }

  const formData = new FormData();
  formData.append('certificado', file);

  try {
    const res = await fetch(`http://localhost:3000/api/certificados/${instalacaoId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.msg);
      // Opcional: redirecionar para a página de técnicos
      window.location.href = 'tecnico.html';
    } else {
      alert(data.msg || 'Erro no envio do certificado.');
    }
  } catch (err) {
    alert('Erro ao comunicar com o servidor.');
    console.error(err);
  }
});


function paginainicial() {
  window.location.href = 'tecnico.html';
}