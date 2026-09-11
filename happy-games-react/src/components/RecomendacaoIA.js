"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import GameCard from '@/components/GameCard';

// Card com a IA que recomenda um jogo do nosso catalogo.
// A pessoa digita o que ela quer jogar e a gente manda pra API /api/recomendar.
export default function RecomendacaoIA() {
  const [pergunta, setPergunta] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  // Manda a pergunta pra API de recomendacao e trata a resposta
  async function pedirRecomendacao(e) {
    e.preventDefault();
    if (!pergunta.trim()) return;

    setCarregando(true);
    setErro('');
    setResultado(null);

    try {
      const res = await fetch('/api/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta })
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || 'Não consegui gerar uma recomendação agora.');
      } else {
        setResultado(data);
      }
    } catch (err) {
      setErro('Não consegui falar com o servidor, tenta de novo.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="bg-gaming-card border border-gaming-cardBorder rounded-2xl p-6 mb-8 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gaming-cardBorder">
        <Sparkles className="w-5 h-5 text-gaming-primary" />
        <h2 className="font-orbitron font-bold text-sm text-white">Não sabe qual jogo escolher? Pergunte pra nossa IA</h2>
      </div>

      <form onSubmit={pedirRecomendacao} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Ex: quero um jogo tranquilo pra jogar sozinho"
          className="flex-grow bg-gaming-bg border border-gaming-cardBorder text-gaming-textLight text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gaming-primary focus:border-gaming-primary"
        />
        <button
          type="submit"
          disabled={carregando}
          className="flex items-center justify-center gap-2 bg-gaming-primary hover:bg-gaming-primary/90 disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all whitespace-nowrap"
        >
          {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{carregando ? 'Pensando...' : 'Recomendar jogo'}</span>
        </button>
      </form>

      <p className="text-gaming-textMuted text-xxs">
        A recomendação é gerada por Inteligência Artificial e só considera jogos que já existem no nosso catálogo.
        Não usamos nome, email ou qualquer outro dado pessoal nessa consulta.
      </p>

      {erro && (
        <p className="text-red-400 text-xs font-semibold bg-red-500/10 border border-red-500/20 rounded-xl p-3">{erro}</p>
      )}

      {resultado && (
        <div className="pt-2 space-y-3 animate-fadeIn">
          <p className="text-gaming-textLight text-sm">
            <span className="text-gaming-primary font-bold">Nossa IA recomenda:</span> {resultado.motivo}
          </p>
          <div className="max-w-xs">
            <GameCard jogo={resultado.jogo} />
          </div>
        </div>
      )}
    </div>
  );
}
