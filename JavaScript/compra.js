// ==============================================
// compra.js – Lógica do formulário de compra (stepper)
// ==============================================

let etapaAtual = 1;

function irPara(etapa) {
  // Se for avançar, valida a etapa anterior
  if (etapa > etapaAtual) {
    if (!validarEtapa(etapaAtual)) return;
  }

  // Atualiza cartões
  document.querySelectorAll('.step-card').forEach(card => card.classList.remove('active'));
  document.getElementById(`step${etapa}`).classList.add('active');

  // Atualiza labels
  document.querySelectorAll('.step-labels span').forEach(label => label.classList.remove('active'));
  for (let i = 1; i <= etapa; i++) {
    document.getElementById(`label${i}`).classList.add('active');
  }

  // Atualiza barra de progresso
  const progresso = etapa === 1 ? 33 : (etapa === 2 ? 66 : 100);
  document.getElementById('progressBar').style.width = `${progresso}%`;

  etapaAtual = etapa;
}

function validarEtapa(etapa) {
  let valido = true;
  
  if (etapa === 1) {
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    
    nome.classList.remove('is-invalid');
    email.classList.remove('is-invalid');

    if (nome.value.trim() === '') {
      nome.classList.add('is-invalid'); valido = false;
    }
    if (email.value.trim() === '' || !email.value.includes('@')) {
      email.classList.add('is-invalid'); valido = false;
    }
  } else if (etapa === 2) {
    const qtd = document.getElementById('quantidade');
    qtd.classList.remove('is-invalid');

    const valor = parseInt(qtd.value, 10);
    if (isNaN(valor) || valor < 1 || valor > 10) {
      qtd.classList.add('is-invalid'); valido = false;
    }
  } else if (etapa === 3) {
    const cartao = document.getElementById('cartao');
    const validade = document.getElementById('validade');
    const cvv = document.getElementById('cvv');

    cartao.classList.remove('is-invalid');
    validade.classList.remove('is-invalid');
    cvv.classList.remove('is-invalid');

    if (cartao.value.replace(/\s/g, '').length < 16) {
      cartao.classList.add('is-invalid'); valido = false;
    }
    if (validade.value.trim().length < 5) {
      validade.classList.add('is-invalid'); valido = false;
    }
    if (cvv.value.trim().length < 3) {
      cvv.classList.add('is-invalid'); valido = false;
    }
  }

  return valido;
}

function atualizarPrecoUnitario() {
  const jogoSelect = document.getElementById('jogo');
  const qtdInput = document.getElementById('quantidade');

  if (!jogoSelect || !qtdInput) return;

  const precoUnit = parseFloat(jogoSelect.options[jogoSelect.selectedIndex].getAttribute('data-preco'));
  const qtd = parseInt(qtdInput.value, 10) || 1;

  const subtotal = precoUnit * qtd;
  
  // Função linear de desconto: d(n) = 5n, teto 20%
  const pctDesc = Math.min(5 * qtd, 20);
  const economia = subtotal * (pctDesc / 100);
  const total = subtotal - economia;

  document.getElementById('precoUnit').textContent = formatarMoeda(precoUnit);
  document.getElementById('pctDesc').textContent = pctDesc;
  document.getElementById('valorDesc').textContent = `- ${formatarMoeda(economia)}`;
  document.getElementById('precoTotal').textContent = formatarMoeda(total);
}

// Máscaras e Eventos
document.addEventListener('DOMContentLoaded', function() {
  atualizarPrecoUnitario();

  const cartao = document.getElementById('cartao');
  if (cartao) {
    cartao.addEventListener('input', function(e) {
      let val = e.target.value.replace(/\D/g, '');
      val = val.replace(/(.{4})/g, '$1 ').trim();
      e.target.value = val;
    });
  }

  const validade = document.getElementById('validade');
  if (validade) {
    validade.addEventListener('input', function(e) {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      e.target.value = val;
    });
  }

  const cvv = document.getElementById('cvv');
  if (cvv) {
    cvv.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
  }

  const btnRevisar = document.getElementById('btnRevisar');
  if (btnRevisar) {
    btnRevisar.addEventListener('click', function() {
      if (validarEtapa(3)) {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const jogo = document.getElementById('jogo').value;
        const qtd = document.getElementById('quantidade').value;
        
        const precoTotal = document.getElementById('precoTotal').textContent;
        const valorDesc = document.getElementById('valorDesc').textContent;

        document.getElementById('rNome').textContent = nome;
        document.getElementById('rEmail').textContent = email;
        document.getElementById('rJogo').textContent = jogo;
        document.getElementById('rQtd').textContent = qtd;
        document.getElementById('rDesc').textContent = valorDesc;
        document.getElementById('rPreco').textContent = precoTotal;

        const modal = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
        modal.show();
      }
    });
  }

  const btnConfirmar = document.getElementById('btnConfirmar');
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', function() {
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const jogo = document.getElementById('jogo').value;
      
      const params = new URLSearchParams({
        nome: nome,
        email: email,
        jogo: jogo
      });
      window.location.href = `obrigado.html?${params.toString()}`;
    });
  }
});
