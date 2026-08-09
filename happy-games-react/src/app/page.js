"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GameCard from '@/components/GameCard';
import { useCarrinho } from '@/context/CarrinhoContext';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Play, ShoppingCart } from 'lucide-react';

// Pagina principal - Home
export default function Home() {
  // Pega a funcao de adicionar do contexto do carrinho
  const { adicionarJogo } = useCarrinho();

  // Estado dos jogos que vem da API
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Controle do carrossel de destaques
  const [slideAtual, setSlideAtual] = useState(0);

  // Busca os jogos da API quando a pagina carrega
  useEffect(() => {
    async function buscarJogos() {
      try {
        const res = await fetch('/api/games');
        if (res.ok) {
          const data = await res.json();
          setJogos(data);
        }
      } catch (error) {
        console.error("Erro ao buscar jogos no Home:", error);
      } finally {
        setCarregando(false);
      }
    }
    buscarJogos();
  }, []);

  // Jogos que aparecem no carrossel de destaque
  const jogosDestaque = [
    {
      nome: "The Last Of Us",
      preco: 199.90,
      genero: "Sobrevivência",
      imagem: "/images/TLOU.jpg",
      descricao: "Joel está em um mundo pós-apocalíptico, 20 anos após um fungo devastar a civilização."
    },
    {
      nome: "GTA 6",
      preco: 349.90,
      genero: "Mundo Aberto",
      imagem: "/images/GTA.jpg",
      descricao: "Acompanhe criminosos e seus esforços para realizar grandes assaltos sob pressão constante."
    },
    {
      nome: "Fortnite",
      preco: 149.90,
      genero: "Battle Royale",
      imagem: "/images/FORT.jpg",
      descricao: "Jogadores buscam recursos, constroem estruturas e tentam sobreviver em partidas de ação."
    }
  ];

  // Timer que troca o slide automaticamente a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % jogosDestaque.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [jogosDestaque.length]);

  // Volta pro slide anterior
  const voltarSlide = () => {
    setSlideAtual((prev) => (prev - 1 + jogosDestaque.length) % jogosDestaque.length);
  };

  // Avanca pro proximo slide
  const avancarSlide = () => {
    setSlideAtual((prev) => (prev + 1) % jogosDestaque.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative w-full h-[320px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-gaming-cardBorder mb-12 group">
        {jogosDestaque.map((item, idx) => (
          <div key={item.nome}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === slideAtual ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover filter brightness-[0.4]" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 bg-gradient-to-t from-gaming-bg via-gaming-bg/60 to-transparent">
              <span className="inline-block bg-gaming-primary/80 border border-gaming-primary/50 text-white text-xs font-extrabold px-3 py-1 rounded-full mb-3">
                {item.genero}
              </span>
              <h1 className="font-orbitron font-black text-2xl md:text-5xl text-white mb-2 tracking-tight">
                {item.nome}
              </h1>
              <p className="text-gaming-textMuted text-sm md:text-base max-w-xl mb-4 line-clamp-2 md:line-clamp-none">
                {item.descricao}
              </p>
              <button
                onClick={() => adicionarJogo(item.nome, item.preco, item.imagem)}
                className="flex items-center gap-2 bg-gaming-primary hover:bg-gaming-primaryHover text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-neon hover:scale-105 active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Adicionar ao carrinho</span>
              </button>
            </div>
          </div>
        ))}
        <button onClick={voltarSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 hover:bg-gaming-primary border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Anterior">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={avancarSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 hover:bg-gaming-primary border border-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Próximo">
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-4 right-6 z-30 flex gap-2">
          {jogosDestaque.map((_, idx) => (
            <button key={idx} onClick={() => setSlideAtual(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === slideAtual ? 'bg-gaming-primary w-6' : 'bg-white/40'}`}
              aria-label={`Ir para slide ${idx + 1}`} />
          ))}
        </div>
      </div>
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="flex items-center gap-2 text-xl md:text-3xl font-black text-gaming-textLight">
            <Sparkles className="w-6 h-6 text-gaming-accent animate-pulse" />
            <span>Jogos em Destaque</span>
          </h2>
          <Link href="/catalogo" className="flex items-center gap-1.5 text-gaming-primary hover:text-gaming-textLight font-semibold transition-colors group text-sm md:text-base">
            <span>Ver todos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {carregando ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gaming-card border border-gaming-cardBorder rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jogos.slice(0, 3).map((jogo) => (
              <GameCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        )}
      </div>
      <section className="bg-gradient-to-r from-gaming-primary/20 via-purple-900/20 to-gaming-bg border border-gaming-cardBorder p-6 md:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="text-center md:text-left">
          <span className="bg-gaming-accent/15 border border-gaming-accent/30 text-gaming-accent text-xxs font-extrabold uppercase px-2.5 py-1 rounded-full mb-3 inline-block">
            Lançamento & Novidades
          </span>
          <h2 className="text-xl md:text-3xl font-black text-white mb-2">
            Confira Nosso Catálogo Completo!
          </h2>
          <p className="text-gaming-textMuted text-sm md:text-base max-w-lg">
            Estamos sempre trazendo atualizações, novos títulos e promoções incríveis. Não fique de fora!
          </p>
        </div>
        <Link href="/catalogo" className="flex items-center gap-2 bg-gaming-accent hover:bg-gaming-accentHover text-white font-bold px-8 py-3.5 rounded-2xl shadow-neonAmber transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
          <Play className="w-4 h-4 fill-white" />
          <span>Explorar Catálogo</span>
        </Link>
      </section>
    </div>
  );
}
