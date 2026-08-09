"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Carrega do localStorage no client-side após a montagem do componente
  useEffect(() => {
    const saved = localStorage.getItem('hg_carrinho');
    if (saved) {
      try {
        setCarrinho(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar carrinho do localStorage", e);
      }
    }
    setMounted(true);
  }, []);

  // Salva no localStorage toda vez que o carrinho mudar (apenas após montagem)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('hg_carrinho', JSON.stringify(carrinho));
    }
  }, [carrinho, mounted]);

  // Função de Desconto (1º Grau): d(n) = 5n (limite 20%)
  // Onde n é a quantidade total de itens (unidades) no carrinho
  const calcularPercentualDesconto = (totalItens) => {
    const a = 5; // taxa de variação (5% por item)
    const b = 0; // valor linear inicial
    const desconto = a * totalItens + b;
    return Math.min(desconto, 20); // Teto máximo de 20%
  };

  // Adicionar item ao carrinho
  const adicionarAoCarrinho = (nome, preco, imagem) => {
    setCarrinho((prev) => {
      const idx = prev.findIndex((item) => item.nome === nome);
      if (idx > -1) {
        const novo = [...prev];
        novo[idx].quantidade += 1;
        return novo;
      }
      return [...prev, { nome, preco, quantidade: 1, imagem }];
    });
  };

  // Remover item do carrinho
  const removerDoCarrinho = (nome) => {
    setCarrinho((prev) => prev.filter((item) => item.nome !== nome));
  };

  // Alterar a quantidade de um item
  const alterarQuantidade = (nome, novaQtd) => {
    const qtd = parseInt(novaQtd, 10);
    if (isNaN(qtd) || qtd < 1) {
      removerDoCarrinho(nome);
      return;
    }
    setCarrinho((prev) =>
      prev.map((item) =>
        item.nome === nome ? { ...item, quantidade: qtd } : item
      )
    );
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
  };

  // Cálculos financeiros
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const descontoPct = calcularPercentualDesconto(totalItens);
  const economia = subtotal * (descontoPct / 100);
  const total = subtotal - economia;

  return (
    <CartContext.Provider
      value={{
        carrinho,
        totalItens,
        subtotal,
        descontoPct,
        economia,
        total,
        adicionarAoCarrinho,
        removerDoCarrinho,
        alterarQuantidade,
        limparCarrinho,
        mounted
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
