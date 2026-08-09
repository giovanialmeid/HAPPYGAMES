"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, ShoppingBag, Mail, Tag, DollarSign } from 'lucide-react';

// Componente que mostra o conteúdo da página de obrigado
function ConteudoPagina() {
  // Pega os parâmetros da URL
  const parametros = useSearchParams();
  const nome = parametros.get('nome') || 'Cliente Especial';
  const email = parametros.get('email') || 'seuemail@exemplo.com';
  const jogo = parametros.get('jogo') || 'Jogo Digital';
  const quantidade = parametros.get('quantidade') || '1';
  const desconto = parseFloat(parametros.get('desconto') || '0');
  const total = parseFloat(parametros.get('total') || '0');

  // Formata um valor numérico como preço em reais
  const formatarPreco = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-gaming-card border border-gaming-cardBorder rounded-3xl p-6 md:p-10 shadow-2xl text-center space-y-6 animate-fadeIn">
      <div className="mx-auto w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 animate-pulse">
        <CheckCircle className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h1 className="font-orbitron font-black text-2xl md:text-3xl text-white">Compra Confirmada!</h1>
        <p className="text-gaming-textMuted text-sm max-w-sm mx-auto">
          Obrigado, <strong className="text-white">{nome}</strong>! Sua transação foi concluída com sucesso e seu jogo já está disponível.
        </p>
      </div>
      <div className="bg-gaming-bg border border-gaming-cardBorder rounded-2xl p-5 text-left text-xs sm:text-sm space-y-3 max-w-sm mx-auto">
        <h3 className="font-orbitron font-extrabold text-xxs text-gaming-textMuted uppercase tracking-wider border-b border-gaming-cardBorder pb-2 mb-2 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-gaming-primary" />
          <span>Resumo do Recibo</span>
        </h3>
        <div className="flex justify-between items-start gap-3">
          <span className="text-gaming-textMuted flex items-center gap-1"><Mail className="w-3.5 h-3.5" /><span>Destinatário</span></span>
          <span className="text-white font-semibold text-right break-all max-w-[180px]">{email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gaming-textMuted flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" /><span>Produto</span></span>
          <span className="text-white font-semibold">{jogo} (x{quantidade})</span>
        </div>
        <div className="flex justify-between text-green-400">
          <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /><span>Desconto</span></span>
          <span className="font-bold">-{formatarPreco(desconto)}</span>
        </div>
        <div className="border-t border-gaming-cardBorder my-2"></div>
        <div className="flex justify-between font-orbitron font-black text-sm">
          <span className="text-gaming-textLight">Total Pago</span>
          <span className="text-white">{formatarPreco(total)}</span>
        </div>
      </div>
      <p className="text-gaming-textMuted text-xxs leading-relaxed max-w-xs mx-auto">
        Um e-mail de confirmação contendo a chave de ativação do jogo e instruções detalhadas de instalação foi enviado para sua caixa de entrada.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link href="/"
          className="flex items-center justify-center gap-1.5 bg-gaming-cardBorder hover:bg-gaming-cardBorder/80 border border-gaming-cardBorder hover:border-gaming-primary/40 text-gaming-textLight text-xs font-bold py-3 px-6 rounded-xl w-full sm:w-auto transition-all">
          <Home className="w-4 h-4" />
          <span>Ir para Home</span>
        </Link>
        <Link href="/catalogo"
          className="flex items-center justify-center gap-1.5 bg-gaming-primary hover:bg-gaming-primaryHover text-white text-xs font-bold py-3 px-6 rounded-xl w-full sm:w-auto transition-all shadow-neon hover:scale-103 active:scale-97">
          <ShoppingBag className="w-4 h-4" />
          <span>Ver mais jogos</span>
        </Link>
      </div>
    </div>
  );
}

// Página principal de agradecimento após a compra
export default function Obrigado() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="text-center py-12 text-gaming-textMuted">
          Carregando informações do pedido...
        </div>
      }>
        <ConteudoPagina />
      </Suspense>
    </div>
  );
}
