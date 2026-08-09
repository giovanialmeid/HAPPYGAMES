"use client";

// Página do carrinho de compras - mostra os jogos adicionados
import React, { useState } from 'react';
import Link from 'next/link';
import { useCarrinho } from '@/context/CarrinhoContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Tag, Info, AlertTriangle } from 'lucide-react';

export default function Carrinho() {
  // Pega os dados e funções do contexto do carrinho
  const {
    carrinho,
    totalItens,
    subtotal,
    porcentagemDesconto,
    economiaValor,
    totalFinal,
    mudarQuantidade,
    removerJogo,
    limparTudo,
    carregado
  } = useCarrinho();

  // Estado pra confirmar se quer limpar tudo
  const [confirmarLimpeza, setConfirmarLimpeza] = useState(false);

  // Função pra formatar preço em reais
  const formatarPreco = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Enquanto não carregou, mostra mensagem de loading
  if (!carregado) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gaming-textMuted">Carregando seu carrinho...</p>
      </div>
    );
  }

  // Se o carrinho tá vazio, mostra tela pra ir pro catálogo
  if (carrinho.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gaming-card border border-gaming-cardBorder rounded-3xl p-8 md:p-12 shadow-xl">
          <ShoppingBag className="w-16 h-16 text-gaming-textMuted mx-auto mb-4 animate-bounce" />
          <h1 className="font-orbitron font-extrabold text-2xl text-white mb-2">Meu Carrinho</h1>
          <p className="text-gaming-textMuted text-sm max-w-sm mx-auto mb-6">
            Seu carrinho está vazio no momento. Adicione alguns jogos do nosso catálogo para começar!
          </p>
          <Link href="/catalogo"
            className="inline-flex items-center gap-2 bg-gaming-primary hover:bg-gaming-primaryHover text-white font-bold px-6 py-3 rounded-2xl shadow-neon transition-all">
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Renderiza o carrinho com os itens
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="flex items-center gap-2.5 text-2xl md:text-3xl font-black text-white mb-8">
        <ShoppingBag className="w-7 h-7 text-gaming-primary" />
        <span>Meu Carrinho</span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Lista dos jogos no carrinho */}
        <div className="lg:col-span-2 space-y-4">
          {carrinho.map((item) => (
            <div key={item.nome}
              className="flex items-center justify-between gap-4 bg-gaming-card border border-gaming-cardBorder p-4 rounded-2xl shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imagem} alt={item.nome}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-gaming-cardBorder flex-shrink-0" />
              <div className="flex-grow min-w-0">
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-white truncate mb-1">{item.nome}</h3>
                <p className="text-gaming-textMuted text-xs sm:text-sm">{formatarPreco(item.preco)} unit.</p>
              </div>
              {/* Botões de + e - pra mudar quantidade */}
              <div className="flex items-center gap-1 bg-gaming-bg border border-gaming-cardBorder rounded-xl p-1 flex-shrink-0">
                <button onClick={() => mudarQuantidade(item.nome, item.quantidade - 1)}
                  className="p-1 hover:bg-gaming-cardBorder rounded text-gaming-textMuted hover:text-white" title="Diminuir">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-orbitron font-bold text-xs sm:text-sm text-white px-2">{item.quantidade}</span>
                <button onClick={() => mudarQuantidade(item.nome, item.quantidade + 1)}
                  className="p-1 hover:bg-gaming-cardBorder rounded text-gaming-textMuted hover:text-white" title="Aumentar">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Botão de remover jogo */}
              <button onClick={() => removerJogo(item.nome)}
                className="p-2 hover:bg-red-500/10 rounded-xl text-gaming-textMuted hover:text-red-400 flex-shrink-0 border border-transparent hover:border-red-500/20"
                title="Remover">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {/* Resumo do pedido com valores */}
        <div className="bg-gaming-card border border-gaming-cardBorder rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="font-orbitron font-bold text-base text-white pb-3 border-b border-gaming-cardBorder flex items-center gap-2">
            <Tag className="w-4 h-4 text-gaming-accent" />
            <span>Resumo do Pedido</span>
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gaming-textMuted">Subtotal</span>
              <span className="text-gaming-textLight font-semibold">{formatarPreco(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-gaming-textMuted">
                <span>Desconto progressivo</span>
                <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xxs font-extrabold px-1.5 py-0.5 rounded">
                  {porcentagemDesconto}%
                </span>
              </span>
              <span className="text-green-400 font-bold">-{formatarPreco(economiaValor)}</span>
            </div>
            <div className="border-t border-gaming-cardBorder my-2"></div>
            <div className="flex items-center justify-between">
              <span className="font-orbitron font-bold text-sm text-gaming-textLight">Total</span>
              <span className="font-orbitron font-black text-xl text-white tracking-tight">{formatarPreco(totalFinal)}</span>
            </div>
          </div>
          {/* Info sobre como funciona o desconto */}
          <div className="bg-gaming-bg border border-gaming-cardBorder p-3 rounded-xl flex gap-2 text-xxs leading-relaxed">
            <Info className="w-4 h-4 text-gaming-primary flex-shrink-0" />
            <p className="text-gaming-textMuted">
              Desconto progressivo: <strong className="text-white">5% por unidade adicionada</strong> no carrinho (teto máx: 20%). Fórmula linear aplicada: <strong className="text-white">d(n) = 5n</strong>.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link href="/compra"
              className="flex items-center justify-center gap-2 bg-gaming-primary hover:bg-gaming-primaryHover text-white font-bold py-3 px-4 rounded-2xl w-full text-center shadow-neon transition-all hover:scale-103 active:scale-97">
              <span>Finalizar Compra</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {/* Confirmação pra limpar carrinho */}
            {confirmarLimpeza ? (
              <div className="flex items-center gap-2 bg-red-950/20 border border-red-900/30 p-2 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-xxs font-bold flex-grow">Tem certeza?</span>
                <button onClick={() => { limparTudo(); setConfirmarLimpeza(false); }}
                  className="bg-red-500 hover:bg-red-600 text-white text-xxs font-bold px-2.5 py-1 rounded">Sim</button>
                <button onClick={() => setConfirmarLimpeza(false)}
                  className="bg-gaming-cardBorder text-gaming-textLight text-xxs font-bold px-2.5 py-1 rounded">Não</button>
              </div>
            ) : (
              <button onClick={() => setConfirmarLimpeza(true)}
                className="w-full text-center border border-red-500/20 hover:border-red-500/40 text-gaming-textMuted hover:text-red-400 text-xs font-semibold py-2.5 rounded-xl transition-all">
                Limpar carrinho
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
