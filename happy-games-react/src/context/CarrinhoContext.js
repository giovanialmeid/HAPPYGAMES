"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Criando o contexto do carrinho
const CarrinhoContext = createContext();

// Componente que envolve o app inteiro e compartilha o estado do carrinho
export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const [carregado, setCarregado] = useState(false);

  // Quando o site carrega, puxa os dados que estavam salvos no navegador
  useEffect(() => {
    const salvo = localStorage.getItem('hg_carrinho');
    if (salvo) {
      try {
        setCarrinho(JSON.parse(salvo));
      } catch (e) {
        console.error("Deu erro ao carregar o carrinho salvo", e);
      }
    }
    setCarregado(true);
  }, []);

  // Toda vez que o carrinho muda, salva no navegador pra nao perder
  useEffect(() => {
    if (carregado) {
      localStorage.setItem('hg_carrinho', JSON.stringify(carrinho));
    }
  }, [carrinho, carregado]);

  // Funcao de desconto (funcao de 1 grau): d(n) = 5n (maximo 20%)
  // n eh a quantidade total de itens no carrinho
  function calcularDesconto(quantidadeTotal) {
    var taxa = 5; // 5% por item
    var desconto = taxa * quantidadeTotal;
    // nao pode passar de 20%
    if (desconto > 20) {
      desconto = 20;
    }
    return desconto;
  }

  // Adicionar um jogo no carrinho
  function adicionarJogo(nome, preco, imagem) {
    setCarrinho(function(anterior) {
      // Procura se ja tem esse jogo no carrinho
      var posicao = -1;
      for (var i = 0; i < anterior.length; i++) {
        if (anterior[i].nome === nome) {
          posicao = i;
          break;
        }
      }

      if (posicao > -1) {
        // Se ja tem, so aumenta a quantidade.
        // Importante criar um objeto novo com {...item} em vez de mexer no antigo,
        // senao o React conta errado (no modo dev ele roda essa funcao 2x pra testar).
        return anterior.map(function(item, indice) {
          if (indice === posicao) {
            return { ...item, quantidade: item.quantidade + 1 };
          }
          return item;
        });
      }
      // Se nao tem, adiciona novo
      return [...anterior, { nome: nome, preco: preco, quantidade: 1, imagem: imagem }];
    });
  }

  // Remover um jogo do carrinho
  function removerJogo(nome) {
    setCarrinho(function(anterior) {
      return anterior.filter(function(item) {
        return item.nome !== nome;
      });
    });
  }

  // Mudar a quantidade de um jogo
  function mudarQuantidade(nome, novaQtd) {
    var qtd = parseInt(novaQtd, 10);
    if (isNaN(qtd) || qtd < 1) {
      removerJogo(nome);
      return;
    }
    setCarrinho(function(anterior) {
      return anterior.map(function(item) {
        if (item.nome === nome) {
          return { ...item, quantidade: qtd };
        }
        return item;
      });
    });
  }

  // Limpar tudo do carrinho
  function limparTudo() {
    setCarrinho([]);
  }

  // Calculos de valores
  var totalItens = 0;
  var subtotal = 0;
  for (var i = 0; i < carrinho.length; i++) {
    totalItens = totalItens + carrinho[i].quantidade;
    subtotal = subtotal + (carrinho[i].preco * carrinho[i].quantidade);
  }

  var porcentagemDesconto = calcularDesconto(totalItens);
  var economiaValor = subtotal * (porcentagemDesconto / 100);
  var totalFinal = subtotal - economiaValor;

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        totalItens,
        subtotal,
        porcentagemDesconto,
        economiaValor,
        totalFinal,
        adicionarJogo,
        removerJogo,
        mudarQuantidade,
        limparTudo,
        carregado
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

// Hook pra acessar o carrinho em qualquer componente
export function useCarrinho() {
  return useContext(CarrinhoContext);
}
