// ==============================================
// catalogo.js – Filtros, busca e ordenação
// ==============================================

function filtrarJogos() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const grid = document.getElementById('jogosGrid');
  const items = Array.from(document.querySelectorAll('.game-item'));
  const noResults = document.getElementById('noResults');
  const contador = document.getElementById('contadorResultados');

  // Gêneros Selecionados
  const generosChecados = Array.from(document.querySelectorAll('input[data-filter-type="genero"]:checked')).map(el => el.value.toLowerCase());
  
  // Plataformas Selecionadas
  const plataformasChecadas = Array.from(document.querySelectorAll('input[data-filter-type="plataforma"]:checked')).map(el => el.value.toLowerCase());

  // Ordenação
  const ordemAsc = document.getElementById('fAsc').checked;
  const ordemDesc = document.getElementById('fDesc').checked;

  let visiveis = 0;

  // Filtragem
  items.forEach(function(item) {
    const nome = item.getAttribute('data-nome').toLowerCase();
    const genero = item.getAttribute('data-genero').toLowerCase();
    const plataforma = item.getAttribute('data-plataforma').toLowerCase();

    const bateBusca = nome.includes(query);
    const bateGenero = generosChecados.length === 0 || generosChecados.includes(genero);
    const batePlataforma = plataformasChecadas.length === 0 || plataformasChecadas.some(plat => plataforma.includes(plat));

    if (bateBusca && bateGenero && batePlataforma) {
      item.style.display = 'block';
      visiveis++;
    } else {
      item.style.display = 'none';
    }
  });

  // Ordenação (Reordena os elementos no DOM se houver critério)
  if (ordemAsc || ordemDesc) {
    items.sort(function(a, b) {
      const precoA = parseFloat(a.getAttribute('data-preco'));
      const precoB = parseFloat(b.getAttribute('data-preco'));
      return ordemAsc ? precoA - precoB : precoB - precoA;
    });

    // Reaplica no grid ordenado (appendChild move os nós no DOM automaticamente)
    items.forEach(function(item) {
      grid.appendChild(item);
    });
  }

  // Atualiza Contador
  if (contador) {
    contador.textContent = `Mostrando ${visiveis} de ${items.length} jogos.`;
  }

  // Tela de "Nenhum resultado"
  if (noResults) {
    noResults.style.display = visiveis === 0 ? 'block' : 'none';
  }
}

function limparFiltros() {
  document.getElementById('searchInput').value = '';
  
  // Limpa Checkboxes e Radios (Usa do-while ou loop simples)
  const checkboxes = document.querySelectorAll('.form-check-input');
  let i = 0;
  
  // Demonstração da estrutura DO-WHILE pedida na Fase 3
  if (checkboxes.length > 0) {
    do {
      checkboxes[i].checked = false;
      i++;
    } while (i < checkboxes.length);
  }

  // Reseta radio de ordenação
  document.getElementById('fAsc').checked = false;
  document.getElementById('fDesc').checked = false;

  filtrarJogos();
}

// Inicializa a listagem com o contador
document.addEventListener('DOMContentLoaded', function() {
  filtrarJogos();
});
