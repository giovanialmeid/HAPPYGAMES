// ==============================================
// sobre.js – Novidades, ranking e cadastro de membros
// ==============================================

var destaques = [
  "Nosso catálogo foi atualizado com novos jogos para todos os estilos.",
  "A comunidade escolheu GTA 6 como um dos jogos mais esperados da semana.",
  "Fortnite continua entre os títulos com maior procura na loja.",
  "God of War Ragnarök entrou em promoção especial nesta semana!",
  "Minecraft celebra 15 anos com conteúdo exclusivo disponível na loja."
];

var indiceDestaque = 0;

function mostrarProximoDestaque() {
  document.getElementById('textoDestaque').textContent = destaques[indiceDestaque];
  document.getElementById('indiceNovidade').textContent = (indiceDestaque + 1) + ' / ' + destaques.length;
  indiceDestaque = (indiceDestaque + 1) % destaques.length;
}

var rankingJogadores = [
  { nome: "Ana",    compras: 12, bonus: 200 },
  { nome: "Bruno",  compras: 9,  bonus: 80  },
  { nome: "Carlos", compras: 8,  bonus: 70  },
  { nome: "Diana",  compras: 6,  bonus: 150 },
  { nome: "Eduardo",compras: 5,  bonus: 50  }
];

function calcularPontuacao(jogador) {
  return 100 * jogador.compras + jogador.bonus;
}

function mostrarRanking() {
  rankingJogadores.sort(function(a, b) {
    return calcularPontuacao(b) - calcularPontuacao(a);
  });

  var lista = document.getElementById('listaRanking');
  lista.innerHTML = '';

  for (var i = 0; i < rankingJogadores.length; i++) {
    var jogador = rankingJogadores[i];
    var score   = calcularPontuacao(jogador);
    var medalha = '';

    switch (i) {
      case 0: medalha = '🥇'; break;
      case 1: medalha = '🥈'; break;
      case 2: medalha = '🥉'; break;
      default: medalha = (i + 1) + 'º';
    }

    var li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML =
      '<span>' + medalha + ' <strong>' + jogador.nome + '</strong></span>' +
      '<span class="badge bg-primary rounded-pill">' + score + ' pts</span>';
    lista.appendChild(li);
  }
}

var membros = [];

function adicionarMembro(nome, jogo) {
  membros.push({ nome: nome, jogo: jogo });
}

function renderizarMembros() {
  var listaMembros = document.getElementById('listaMembros');
  var cardMembros  = document.getElementById('cardMembros');

  if (membros.length === 0) {
    cardMembros.style.display = 'none';
    return;
  }

  cardMembros.style.display = 'block';
  listaMembros.innerHTML = '';

  var idx = 0;
  while (idx < membros.length) {
    var membro = membros[idx];
    var li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between';
    li.innerHTML =
      '<span><i class="bi bi-person-circle me-2 text-primary"></i><strong>' + membro.nome + '</strong></span>' +
      '<span class="text-muted">' + membro.jogo + '</span>';
    listaMembros.appendChild(li);
    idx++;
  }
}

function mostrarErro(campo, mensagemId, mensagem) {
  campo.classList.add('is-invalid');
  document.getElementById(mensagemId).textContent = mensagem;
}

function limparErro(campo, mensagemId) {
  campo.classList.remove('is-invalid');
  document.getElementById(mensagemId).textContent = '';
}

function cadastrarComunidade(event) {
  event.preventDefault();

  var nome   = document.getElementById('nomeCadastro');
  var jogo   = document.getElementById('jogoCadastro');
  var msg    = document.getElementById('mensagemCadastro');
  var valido = true;

  limparErro(nome, 'erroNome');
  limparErro(jogo, 'erroJogo');
  msg.innerHTML = '';

  if (nome.value.trim() === '') {
    mostrarErro(nome, 'erroNome', 'Digite seu nome.'); valido = false;
  }
  if (jogo.value.trim() === '') {
    mostrarErro(jogo, 'erroJogo', 'Digite seu jogo favorito.'); valido = false;
  }

  if (valido) {
    adicionarMembro(nome.value.trim(), jogo.value.trim());
    renderizarMembros();
    msg.innerHTML = '<div class="alert alert-success mt-3"><i class="bi bi-check-circle me-2"></i>Cadastro realizado com sucesso! Bem-vindo(a), <strong>' + nome.value.trim() + '</strong>!</div>';
    document.getElementById('formCadastro').reset();
  }
}

document.getElementById('btnTrocarConteudo').addEventListener('click', mostrarProximoDestaque);
document.getElementById('formCadastro').addEventListener('submit', cadastrarComunidade);

mostrarProximoDestaque();
indiceDestaque = 1;
document.getElementById('textoDestaque').textContent = destaques[0];
document.getElementById('indiceNovidade').textContent = '1 / ' + destaques.length;

mostrarRanking();
