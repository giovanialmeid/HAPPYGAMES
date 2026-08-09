// ==============================================
// carrinho-page.js – Renderiza a página do carrinho
// ==============================================

function renderizarCarrinho() {
  const lista = document.getElementById('listaItens');
  const vazio = document.getElementById('carrinhoVazio');
  const conteudo = document.getElementById('carrinhoConteudo');

  if (!lista || !vazio || !conteudo) return;

  if (carrinho.length === 0) {
    vazio.classList.remove('d-none');
    conteudo.classList.add('d-none');
    return;
  }

  vazio.classList.add('d-none');
  conteudo.classList.remove('d-none');
  lista.innerHTML = '';

  // Renderiza cada item usando for/forEach
  carrinho.forEach(function(item) {
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center justify-content-between border p-3 mb-2 rounded bg-white';
    
    // Tenta carregar a imagem do jogo com caminho relativo correto
    const imgName = getImgName(item.nome);
    const imgSrc = `../Imagens/${imgName}`;

    div.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${imgSrc}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover;" class="rounded border">
        <div>
          <h6 class="mb-0 fw-bold">${item.nome}</h6>
          <small class="text-muted">${formatarMoeda(item.preco)}</small>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="alterarQtd('${item.nome}', ${item.quantidade - 1})">-</button>
        <span class="fw-bold">${item.quantidade}</span>
        <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="alterarQtd('${item.nome}', ${item.quantidade + 1})">+</button>
        <button class="btn btn-sm btn-outline-danger ms-3" onclick="remover('${item.nome}')">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    lista.appendChild(div);
  });

  // Atualiza Resumo Financeiro
  const resumo = calcularTotalComDesconto();
  document.getElementById('resumoSubtotal').textContent = formatarMoeda(resumo.subtotal);
  document.getElementById('badgePct').textContent = `${resumo.pct}%`;
  document.getElementById('resumoDesconto').textContent = `- ${formatarMoeda(resumo.economia)}`;
  document.getElementById('resumoTotal').textContent = formatarMoeda(resumo.total);
}

function getImgName(nome) {
  switch (nome.toLowerCase()) {
    case 'the last of us': return 'TLOU.jpg';
    case 'gta 6': return 'GTA.jpg';
    case 'fortnite': return 'FORT.jpg';
    case 'ea sports fc 26': return 'FC26.jpg';
    case 'minecraft': return 'MINE.jpg';
    case 'god of war ragnarök': return 'GOW.jpg';
    default: return 'TLOU.jpg';
  }
}

function alterarQtd(nome, qtd) {
  alterarQuantidade(nome, qtd);
  renderizarCarrinho();
}

function remover(nome) {
  removerDoCarrinho(nome);
  renderizarCarrinho();
}

function confirmarLimpar() {
  if (confirm("Deseja realmente limpar todo o carrinho?")) {
    limparCarrinho();
    renderizarCarrinho();
  }
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', renderizarCarrinho);
