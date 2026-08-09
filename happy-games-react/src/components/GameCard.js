"use client";

import React from 'react';
import { useCarrinho } from '@/context/CarrinhoContext';
import { ShoppingCart, Monitor, ShieldAlert } from 'lucide-react';

// card de cada jogo no catálogo
export default function GameCard({ jogo }) {
  const { adicionarJogo } = useCarrinho();

  // retorna as cores certas pra cada gênero de jogo
  const corDoGenero = (genero) => {
    switch (genero?.toLowerCase()) {
      case 'sobrevivência': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'mundo aberto': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'battle royale': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'esporte': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'sandbox': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ação': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    }
  };

  // formata o preço em reais
  const formatarPreco = (preco) => {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="group flex flex-col bg-gaming-card border border-gaming-cardBorder rounded-2xl overflow-hidden shadow-lg hover:border-gaming-primary hover:shadow-neon transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={jogo.imagem} alt={jogo.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-bg via-transparent to-transparent opacity-60"></div>
      </div>
      <div className="flex flex-col flex-grow p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${corDoGenero(jogo.genero)}`}>
            {jogo.genero}
          </span>
          {jogo.plataforma && jogo.plataforma.split(' ').map((plat) => (
            <span key={plat} className="text-xs font-semibold px-2 py-0.5 bg-gaming-cardBorder text-gaming-textLight rounded border border-gray-700 uppercase">
              {plat}
            </span>
          ))}
        </div>
        <h3 className="font-orbitron font-bold text-lg text-gaming-textLight mb-2 group-hover:text-gaming-primary transition-colors">
          {jogo.nome}
        </h3>
        <p className="text-gaming-textMuted text-sm line-clamp-2 mb-4 flex-grow">
          {jogo.descricao}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-orbitron font-extrabold text-xl text-gaming-textLight">
            {formatarPreco(jogo.preco)}
          </span>
          <button
            onClick={() => adicionarJogo(jogo.nome, jogo.preco, jogo.imagem)}
            className="flex items-center gap-1 bg-gaming-primary hover:bg-gaming-primaryHover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            title="Adicionar ao Carrinho"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
