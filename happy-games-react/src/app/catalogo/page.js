"use client";

import React, { useState, useEffect } from 'react';
import GameCard from '@/components/GameCard';
import { Search, Sliders, X, RefreshCw, Grid } from 'lucide-react';

// Pagina do catalogo - mostra todos os jogos com filtros
export default function Catalogo() {
  // Estado dos jogos que vem da API
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // Estados dos filtros e busca
  const [busca, setBusca] = useState('');
  const [generosSelecionados, setGenerosSelecionados] = useState([]);
  const [plataformasSelecionadas, setPlataformasSelecionadas] = useState([]);
  const [ordenacao, setOrdenacao] = useState(''); // 'asc' | 'desc' | ''
  const [menuFiltroAberto, setMenuFiltroAberto] = useState(false);

  // Busca os jogos da API quando a pagina carrega
  useEffect(() => {
    async function carregarJogos() {
      try {
        const res = await fetch('/api/games');
        if (res.ok) {
          const data = await res.json();
          setJogos(data);
        }
      } catch (err) {
        console.error("Erro ao buscar catálogo de jogos:", err);
      } finally {
        setCarregando(false);
      }
    }
    carregarJogos();
  }, []);

  // Listas de opcoes para os filtros
  const listaGeneros = ['Ação', 'Sobrevivência', 'Mundo Aberto', 'Battle Royale', 'Esporte', 'Sandbox'];
  const listaPlataformas = ['PS5', 'Xbox', 'PC'];

  // Marca ou desmarca um genero no filtro
  const mudarGenero = (genero) => {
    setGenerosSelecionados((prev) =>
      prev.includes(genero) ? prev.filter((g) => g !== genero) : [...prev, genero]
    );
  };

  // Marca ou desmarca uma plataforma no filtro
  const mudarPlataforma = (plataforma) => {
    setPlataformasSelecionadas((prev) =>
      prev.includes(plataforma) ? prev.filter((p) => p !== plataforma) : [...prev, plataforma]
    );
  };

  // Limpa todos os filtros de uma vez
  const limparTodosFiltros = () => {
    setBusca('');
    setGenerosSelecionados([]);
    setPlataformasSelecionadas([]);
    setOrdenacao('');
  };

  // Filtra e ordena os jogos (sem usar useMemo, so variavel normal)
  var jogosFiltrados = [...jogos];

  // 1. Filtro de busca por nome
  if (busca.trim() !== '') {
    var termoBusca = busca.toLowerCase();
    jogosFiltrados = jogosFiltrados.filter(function(j) {
      return j.nome.toLowerCase().includes(termoBusca);
    });
  }

  // 2. Filtro de genero
  if (generosSelecionados.length > 0) {
    jogosFiltrados = jogosFiltrados.filter(function(j) {
      return generosSelecionados.some(function(g) {
        return j.genero.toLowerCase() === g.toLowerCase();
      });
    });
  }

  // 3. Filtro de plataforma
  if (plataformasSelecionadas.length > 0) {
    jogosFiltrados = jogosFiltrados.filter(function(j) {
      return plataformasSelecionadas.some(function(p) {
        return j.plataforma.toLowerCase().includes(p.toLowerCase());
      });
    });
  }

  // 4. Ordenacao por preco
  if (ordenacao === 'asc') {
    jogosFiltrados.sort(function(a, b) { return a.preco - b.preco; });
  } else if (ordenacao === 'desc') {
    jogosFiltrados.sort(function(a, b) { return b.preco - a.preco; });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-black text-white">
            <Grid className="w-7 h-7 text-gaming-primary" />
            <span>Catálogo Completo</span>
          </h1>
          <p className="text-gaming-textMuted text-sm mt-1">
            Explore nossos títulos, ordene por preço ou filtre por categoria.
          </p>
        </div>

        {/* Barra de Busca + Botão Filtro Mobile */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <input
              type="text"
              placeholder="Buscar jogo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-gaming-card border border-gaming-cardBorder text-gaming-textLight rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gaming-primary focus:ring-1 focus:ring-gaming-primary"
            />
            <Search className="w-4 h-4 text-gaming-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            onClick={() => setMenuFiltroAberto(true)}
            className="md:hidden flex items-center gap-1.5 bg-gaming-card border border-gaming-cardBorder text-gaming-textLight px-4 py-2.5 rounded-xl text-sm hover:border-gaming-primary"
          >
            <Sliders className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Resultados e Grid Principal */}
      <div className="flex gap-8 items-start">
        
        {/* FILTROS LATERAL (DESKTOP) */}
        <aside className="hidden md:block w-64 flex-shrink-0 bg-gaming-card border border-gaming-cardBorder rounded-2xl p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gaming-cardBorder">
            <h2 className="font-orbitron font-bold text-sm text-gaming-textLight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-gaming-primary" />
              <span>Filtrar Jogos</span>
            </h2>
            {(generosSelecionados.length > 0 || plataformasSelecionadas.length > 0 || ordenacao !== '' || busca !== '') && (
              <button
                onClick={limparTodosFiltros}
                className="text-gaming-primary hover:text-gaming-textLight text-xs font-semibold flex items-center gap-0.5"
                title="Limpar todos"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          {/* Gênero */}
          <div className="mb-6">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Gênero</h3>
            <div className="space-y-2">
              {listaGeneros.map((genero) => (
                <label key={genero} className="flex items-center gap-2.5 text-sm text-gaming-textMuted hover:text-gaming-textLight cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generosSelecionados.includes(genero)}
                    onChange={() => mudarGenero(genero)}
                    className="w-4 h-4 rounded border-gaming-cardBorder text-gaming-primary bg-gaming-bg focus:ring-gaming-primary"
                  />
                  <span>{genero}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Plataforma */}
          <div className="mb-6">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Plataforma</h3>
            <div className="space-y-2">
              {listaPlataformas.map((plataforma) => (
                <label key={plataforma} className="flex items-center gap-2.5 text-sm text-gaming-textMuted hover:text-gaming-textLight cursor-pointer">
                  <input
                    type="checkbox"
                    checked={plataformasSelecionadas.includes(plataforma)}
                    onChange={() => mudarPlataforma(plataforma)}
                    className="w-4 h-4 rounded border-gaming-cardBorder text-gaming-primary bg-gaming-bg focus:ring-gaming-primary"
                  />
                  <span>{plataforma}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ordenação por Preço */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Ordenar por Preço</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-sm text-gaming-textMuted hover:text-gaming-textLight cursor-pointer">
                <input
                  type="radio"
                  name="ordemPreco"
                  checked={ordenacao === 'asc'}
                  onChange={() => setOrdenacao('asc')}
                  className="w-4 h-4 border-gaming-cardBorder text-gaming-primary bg-gaming-bg focus:ring-gaming-primary"
                />
                <span>Menor preço</span>
              </label>
              <label className="flex items-center gap-2.5 text-sm text-gaming-textMuted hover:text-gaming-textLight cursor-pointer">
                <input
                  type="radio"
                  name="ordemPreco"
                  checked={ordenacao === 'desc'}
                  onChange={() => setOrdenacao('desc')}
                  className="w-4 h-4 border-gaming-cardBorder text-gaming-primary bg-gaming-bg focus:ring-gaming-primary"
                />
                <span>Maior preço</span>
              </label>
            </div>
          </div>
        </aside>

        {/* CONTEÚDO / GRID DE JOGOS */}
        <div className="flex-grow">
          {/* Contador de Resultados */}
          {!carregando && (
            <p className="text-gaming-textMuted text-xs mb-4">
              Mostrando <span className="text-white font-bold">{jogosFiltrados.length}</span> de <span className="text-white font-bold">{jogos.length}</span> jogos encontrados.
            </p>
          )}

          {carregando ? (
            // Skeleton Loader
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-gaming-card border border-gaming-cardBorder rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : jogosFiltrados.length === 0 ? (
            // Estado Vazio (Nenhum resultado)
            <div className="bg-gaming-card border border-gaming-cardBorder rounded-2xl py-16 px-4 text-center">
              <Search className="w-12 h-12 text-gaming-textMuted mx-auto mb-4" />
              <h3 className="font-orbitron font-extrabold text-lg text-white mb-2">Nenhum jogo encontrado</h3>
              <p className="text-gaming-textMuted text-sm max-w-xs mx-auto mb-6">
                Não conseguimos encontrar nenhum jogo com os filtros selecionados. Tente ajustar os parâmetros.
              </p>
              <button
                onClick={limparTodosFiltros}
                className="bg-gaming-cardBorder hover:bg-gaming-primary hover:text-white border border-gaming-cardBorder hover:border-gaming-primary text-gaming-textLight font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            // Grid de Cards
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {jogosFiltrados.map((jogo) => (
                <GameCard key={jogo.id} jogo={jogo} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* OFFCANVAS / MODAL FILTROS MOBILE */}
      {menuFiltroAberto && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div onClick={() => setMenuFiltroAberto(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          {/* Menu de Filtros (Slide-in) */}
          <div className="relative w-80 max-w-xs h-full bg-gaming-card border-l border-gaming-cardBorder p-6 flex flex-col overflow-y-auto z-10 animate-slideLeft">
            <div className="flex items-center justify-between pb-4 border-b border-gaming-cardBorder mb-6">
              <h2 className="font-orbitron font-bold text-sm text-gaming-textLight flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gaming-primary" />
                <span>Filtrar</span>
              </h2>
              <button onClick={() => setMenuFiltroAberto(false)} className="p-1 hover:bg-gaming-cardBorder rounded text-gaming-textMuted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gêneros */}
            <div className="mb-6">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Gênero</h3>
              <div className="space-y-2">
                {listaGeneros.map((genero) => (
                  <label key={genero} className="flex items-center gap-2.5 text-sm text-gaming-textMuted hover:text-gaming-textLight cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generosSelecionados.includes(genero)}
                      onChange={() => mudarGenero(genero)}
                      className="w-4 h-4 rounded border-gaming-cardBorder text-gaming-primary bg-gaming-bg"
                    />
                    <span>{genero}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Plataforma */}
            <div className="mb-6">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Plataforma</h3>
              <div className="space-y-2">
                {listaPlataformas.map((plataforma) => (
                  <label key={plataforma} className="flex items-center gap-2.5 text-sm text-gaming-textMuted hover:text-gaming-textLight cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plataformasSelecionadas.includes(plataforma)}
                      onChange={() => mudarPlataforma(plataforma)}
                      className="w-4 h-4 rounded border-gaming-cardBorder text-gaming-primary bg-gaming-bg"
                    />
                    <span>{plataforma}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ordenação por Preço */}
            <div className="mb-8">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Ordenar por Preço</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-sm text-gaming-textMuted hover:text-gaming-textLight cursor-pointer">
                  <input
                    type="radio"
                    name="ordemPrecoMobile"
                    checked={ordenacao === 'asc'}
                    onChange={() => setOrdenacao('asc')}
                    className="w-4 h-4 border-gaming-cardBorder text-gaming-primary bg-gaming-bg"
                  />
                  <span>Menor preço</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm text-gaming-textMuted hover:text-gaming-textLight cursor-pointer">
                  <input
                    type="radio"
                    name="ordemPrecoMobile"
                    checked={ordenacao === 'desc'}
                    onChange={() => setOrdenacao('desc')}
                    className="w-4 h-4 border-gaming-cardBorder text-gaming-primary bg-gaming-bg"
                  />
                  <span>Maior preço</span>
                </label>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-auto flex gap-3">
              <button
                onClick={() => { limparTodosFiltros(); setMenuFiltroAberto(false); }}
                className="flex-1 bg-gaming-cardBorder border border-gaming-cardBorder text-gaming-textLight text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                Limpar
              </button>
              <button
                onClick={() => setMenuFiltroAberto(false)}
                className="flex-1 bg-gaming-primary text-white text-xs font-bold py-2.5 rounded-xl shadow-neon transition-all"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
