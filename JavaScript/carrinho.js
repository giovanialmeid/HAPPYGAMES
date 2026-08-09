// ==============================================
// carrinho.js – Guarda os jogos que a pessoa adicionou
//
// Cada item e um objeto com nome, preco e quantidade.
// O desconto sobe 5% por item, d(n) = 5n, e para em 20%.
// ==============================================

// ==============================================
// Lista dos itens do carrinho
// ==============================================
let carrinho = JSON.parse(localStorage.getItem('hg_carrinho') || '[]');

// ==============================================
// PERSISTÊNCIA
// ==============================================
function salvarCarrinho() {
  localStorage.setItem('hg_carrinho', JSON.stringify(carrinho));
}

// ==============================================
// FUNÇÃO DE DESCONTO  (função de 1º grau)
//   d(n) = 5 * n   →  porcentagem de desconto
//   onde n = total de itens distintos no carrinho
//   Limite máximo: 20%
//   Ex.: 1 jogo → 5%, 2 → 10%, 3+ → 15%, 4+ → 20%
// ==============================================
function calcularPercentualDesconto(totalItens) {
  const a = 5;           // coeficiente angular (taxa por item)
  const b = 0;           // coeficiente linear (sem desconto base)
  const desconto = a * totalItens + b;  // d(n) = 5n
  return Math.min(desconto, 20);        // teto em 20%
}

// ==============================================
// TOTAL BRUTO
// ==============================================
function calcularSubtotal() {
  return carrinho.reduce(function(acc, item) {
    return acc + item.preco * item.quantidade;
  }, 0);
}

// ==============================================
// TOTAL DE ITENS (soma das quantidades)
// ==============================================
function calcularTotalItens() {
  return carrinho.reduce(function(acc, item) {
    return acc + item.quantidade;
  }, 0);
}

// ==============================================
// TOTAL COM DESCONTO
// ==============================================
function calcularTotalComDesconto() {
  const subtotal = calcularSubtotal();
  const pct      = calcularPercentualDesconto(calcularTotalItens());
  const economia = subtotal * (pct / 100);
  return {
    subtotal : subtotal,
    pct      : pct,
    economia : economia,
    total    : subtotal - economia
  };
}

// ==============================================
// ADICIONAR AO CARRINHO
// ==============================================
function adicionarAoCarrinho(nome, preco) {
  var encontrado = false;
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nome) {
      carrinho[i].quantidade++;
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
  }
  salvarCarrinho();
  atualizarBadgeCarrinho();
  exibirToastCarrinho(nome);
}

// ==============================================
// REMOVER DO CARRINHO
// ==============================================
function removerDoCarrinho(nome) {
  carrinho = carrinho.filter(function(item) {
    return item.nome !== nome;
  });
  salvarCarrinho();
  atualizarBadgeCarrinho();
}

// ==============================================
// ALTERAR QUANTIDADE
// ==============================================
function alterarQuantidade(nome, novaQtd) {
  var qtd = parseInt(novaQtd, 10);
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nome) {
      if (qtd < 1) {
        removerDoCarrinho(nome);
      } else {
        carrinho[i].quantidade = qtd;
        salvarCarrinho();
        atualizarBadgeCarrinho();
      }
      break;
    }
  }
}

// ==============================================
// LIMPAR CARRINHO
// ==============================================
function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  atualizarBadgeCarrinho();
}

// ==============================================
// ATUALIZAR BADGE NA NAVBAR
// ==============================================
function atualizarBadgeCarrinho() {
  var total = calcularTotalItens();
  var badges = document.querySelectorAll('#cartBadgeNav, .cart-badge');
  badges.forEach(function(badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ==============================================
// TOAST DE CONFIRMAÇÃO
// ==============================================
function exibirToastCarrinho(nome) {
  var msgEl = document.getElementById('toastMsg');
  var toastEl = document.getElementById('gameToast');
  if (!msgEl || !toastEl) return;
  msgEl.textContent = '"' + nome + '" adicionado ao carrinho!';
  var toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

// ==============================================
// FORMATAR MOEDA BRL
// ==============================================
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Inicializa badge ao carregar qualquer página
document.addEventListener('DOMContentLoaded', atualizarBadgeCarrinho);

// ==============================================
// BARRA DE ACESSIBILIDADE ESTÁTICA (SPACECONNECT SPEC)
// ==============================================
var altoContrasteAtivo = localStorage.getItem('sc_alto_contraste') === 'true';
var tamanhoFonte = localStorage.getItem('sc_font_size') || 'normal';
var vozAtiva = localStorage.getItem('sc_voz_ativa') === 'true';

document.addEventListener('DOMContentLoaded', function() {
  // Cria e injeta a barra de acessibilidade no topo
  var bar = document.createElement('div');
  bar.className = 'accessibility-bar';
  bar.innerHTML = `
    <div class="container d-flex justify-content-between align-items-center">
      <div>
        <span>Acessibilidade Digital:</span>
        <button id="btnContraste" class="btn-access" title="Alternar modo de alto contraste para melhor leitura">
          <i class="bi bi-contrast"></i> Alto Contraste
        </button>
        <button id="btnVoz" class="btn-access" title="Ativar leitura por voz ao clicar nos elementos">
          <i class="bi bi-volume-up"></i> Leitor de Voz
        </button>
      </div>
      <div>
        <span>Tamanho do Texto:</span>
        <button id="btnFontNormal" class="btn-access" title="Redefinir tamanho da fonte para o padrão">A</button>
        <button id="btnFontAumentar" class="btn-access" title="Aumentar tamanho do texto do site">A+</button>
      </div>
    </div>
  `;
  document.body.insertBefore(bar, document.body.firstChild);

  // Executa inicialização
  rodarAcessibilidade();
  configurarBotoesAcessibilidade();
});

function rodarAcessibilidade() {
  var corpo = document.body;

  // Alto Contraste
  if (altoContrasteAtivo === true) {
    corpo.classList.add('alto-contraste');
    mudarBotaoContraste(true);
  } else {
    corpo.classList.remove('alto-contraste');
    mudarBotaoContraste(false);
  }

  // Fonte
  corpo.classList.remove('font-lg', 'font-xl');
  if (tamanhoFonte === 'lg') {
    corpo.classList.add('font-lg');
  } else if (tamanhoFonte === 'xl') {
    corpo.classList.add('font-xl');
  }

  // Botão Voz
  mudarBotaoVoz(vozAtiva);
}

function configurarBotoesAcessibilidade() {
  var btnContraste = document.getElementById('btnContraste');
  if (btnContraste) {
    btnContraste.addEventListener('click', function() {
      altoContrasteAtivo = !altoContrasteAtivo;
      localStorage.setItem('sc_alto_contraste', altoContrasteAtivo);
      rodarAcessibilidade();
      falarTextoSeAtivo("Modo de contraste alterado.");
    });
  }

  var btnFontNormal = document.getElementById('btnFontNormal');
  if (btnFontNormal) {
    btnFontNormal.addEventListener('click', function() {
      tamanhoFonte = 'normal';
      localStorage.setItem('sc_font_size', tamanhoFonte);
      rodarAcessibilidade();
      falarTextoSeAtivo("Tamanho da letra voltou ao normal.");
    });
  }

  var btnFontAumentar = document.getElementById('btnFontAumentar');
  if (btnFontAumentar) {
    btnFontAumentar.addEventListener('click', function() {
      if (tamanhoFonte === 'normal') {
        tamanhoFonte = 'lg';
      } else if (tamanhoFonte === 'lg') {
        tamanhoFonte = 'xl';
      }
      localStorage.setItem('sc_font_size', tamanhoFonte);
      rodarAcessibilidade();
      falarTextoSeAtivo("Tamanho da letra aumentado.");
    });
  }

  var btnVoz = document.getElementById('btnVoz');
  if (btnVoz) {
    btnVoz.addEventListener('click', function() {
      vozAtiva = !vozAtiva;
      localStorage.setItem('sc_voz_ativa', vozAtiva);
      mudarBotaoVoz(vozAtiva);
      
      if (vozAtiva === true) {
        falarTexto("Leitor de voz ligado. Clique nas informações ou botões para ouvir.");
      } else {
        window.speechSynthesis.cancel();
      }
    });
  }

  // Leitor de clique
  document.body.addEventListener('click', function(e) {
    if (vozAtiva === false) return;
    
    // Procura elemento com narrador ou lê texto simples
    var elemento = e.target;
    while (elemento && elemento !== document.body) {
      if (elemento.hasAttribute('data-narrar') || elemento.tagName === 'BUTTON' || elemento.tagName === 'A' || elemento.tagName === 'H5' || elemento.tagName === 'H2') {
        var textoParaFalar = elemento.getAttribute('data-narrar') || elemento.textContent;
        falarTexto(textoParaFalar);
        break;
      }
      elemento = elemento.parentElement;
    }
  });
}

function mudarBotaoContraste(ativo) {
  var b = document.getElementById('btnContraste');
  if (!b) return;
  if (ativo === true) {
    b.innerHTML = '<i class="bi bi-brightness-high"></i> Contraste Normal';
  } else {
    b.innerHTML = '<i class="bi bi-contrast"></i> Alto Contraste';
  }
}

function mudarBotaoVoz(ativo) {
  var b = document.getElementById('btnVoz');
  if (!b) return;
  if (ativo === true) {
    b.innerHTML = '<i class="bi bi-volume-mute"></i> Desativar Voz';
  } else {
    b.innerHTML = '<i class="bi bi-volume-up"></i> Ouvir Tela';
  }
}

function falarTexto(mensagem) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    var fala = new SpeechSynthesisUtterance(mensagem);
    fala.lang = 'pt-BR';
    fala.rate = 1.1; // Velocidade ligeiramente maior para fluidez
    window.speechSynthesis.speak(fala);
  }
}

function falarTextoSeAtivo(mensagem) {
  if (vozAtiva === true) {
    falarTexto(mensagem);
  }
}


