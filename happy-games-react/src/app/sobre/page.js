"use client";

import React, { useState, useEffect } from 'react';
import { Rocket, Target, Award, Shield, Newspaper, Trophy, UserPlus, Users, RotateCw, CheckCircle2, Lock } from 'lucide-react';

// Ve se a senha e forte. Cada regra que ela cumpre vale 1 ponto, no maximo 4.
function calcularForcaSenha(senha) {
  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  if (pontos <= 1) return { pontos, nivel: 'Fraca', cor: 'bg-red-500', texto: 'text-red-400' };
  if (pontos <= 3) return { pontos, nivel: 'Média', cor: 'bg-yellow-500', texto: 'text-yellow-400' };
  return { pontos, nivel: 'Forte', cor: 'bg-green-500', texto: 'text-green-400' };
}

// Página "Sobre" da Happy Games
export default function Sobre() {

  // Lista de novidades que aparecem na seção da comunidade
  const novidadesComunidade = [
    "Nosso catálogo foi atualizado com novos jogos para todos os estilos.",
    "A comunidade escolheu GTA 6 como um dos jogos mais esperados da semana.",
    "Fortnite continua entre os títulos com maior procura na loja.",
    "God of War Ragnarök entrou em promoção especial nesta semana!",
    "Minecraft celebra 15 anos com conteúdo exclusivo disponível na loja."
  ];

  // Controla qual novidade está sendo mostrada
  const [novidadeAtual, setNovidadeAtual] = useState(0);

  // Avança para a próxima novidade da lista
  const proximaNovidade = () => {
    setNovidadeAtual((prev) => (prev + 1) % novidadesComunidade.length);
  };

  // Dados iniciais dos jogadores pro ranking
  const jogadoresIniciais = [
    { nome: "Ana", compras: 12, bonus: 200 },
    { nome: "Bruno", compras: 9, bonus: 80 },
    { nome: "Carlos", compras: 8, bonus: 70 },
    { nome: "Diana", compras: 6, bonus: 150 },
    { nome: "Eduardo", compras: 5, bonus: 50 }
  ];

  // Calcula os pontos de cada jogador: 100 * compras + bonus
  const calcularPontos = (jogador) => {
    return 100 * jogador.compras + jogador.bonus;
  };

  // Ordena o ranking do maior pro menor
  const rankingFinal = [...jogadoresIniciais].sort((a, b) => {
    return calcularPontos(b) - calcularPontos(a);
  });

  // Retorna o emoji de medalha ou a posição
  const obterMedalha = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}º`;
    }
  };

  // Estados do formulário de cadastro de membros
  const [listaMembros, setListaMembros] = useState([]);
  const [campoNome, setCampoNome] = useState('');
  const [campoJogo, setCampoJogo] = useState('');
  const [campoSenha, setCampoSenha] = useState('');
  const [errosForm, setErrosForm] = useState({});
  const [mensagemOk, setMensagemOk] = useState('');

  // Recalcula a cada letra digitada pra barrinha mudar de cor na hora
  const forcaSenha = calcularForcaSenha(campoSenha);

  // Função que salva um novo membro na lista
  const salvarMembro = (e) => {
    e.preventDefault();
    const novosErros = {};
    setMensagemOk('');
    if (!campoNome.trim()) { novosErros.nome = 'Por favor, digite seu nome.'; }
    if (!campoJogo.trim()) { novosErros.jogo = 'Por favor, digite seu jogo favorito.'; }
    // So deixa cadastrar se a senha passar nas 4 regras
    if (!campoSenha) {
      novosErros.senha = 'Por favor, crie uma senha.';
    } else if (forcaSenha.pontos < 4) {
      novosErros.senha = 'Senha fraca. Use 8+ caracteres, 1 maiúscula, 1 número e 1 caractere especial.';
    }
    if (Object.keys(novosErros).length > 0) { setErrosForm(novosErros); return; }

    // Nao salvo a senha em lugar nenhum, so uso ela aqui pra validar e pronto
    setListaMembros(prev => [...prev, { nome: campoNome.trim(), jogo: campoJogo.trim() }]);
    setMensagemOk(`Cadastro realizado com sucesso! Bem-vindo(a), ${campoNome.trim()}!`);
    setCampoNome('');
    setCampoJogo('');
    setCampoSenha('');
    setErrosForm({});
  };

  // Monta a lista de quem se cadastrou
  const desenharListaMembros = () => {
    const listItems = [];
    let idx = 0;
    while (idx < listaMembros.length) {
      const membro = listaMembros[idx];
      listItems.push(
        <li key={idx}
          className="flex justify-between items-center py-2.5 px-4 bg-gaming-bg border border-gaming-cardBorder rounded-xl text-xs sm:text-sm">
          <span className="flex items-center gap-2 text-gaming-textLight font-semibold">
            <span className="w-2 h-2 rounded-full bg-gaming-primary"></span>
            {membro.nome}
          </span>
          <span className="text-gaming-textMuted italic">{membro.jogo}</span>
        </li>
      );
      idx++;
    }
    return listItems;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gaming-primary to-purple-400">
          Sobre a Happy Games
        </h1>
        <p className="text-gaming-textMuted text-sm max-w-lg mx-auto">
          Conectando jogadores aos seus mundos virtuais favoritos de forma inteligente, acessível e divertida.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gaming-card border border-gaming-cardBorder p-6 rounded-2xl shadow-lg flex gap-4 items-start">
          <div className="p-3 bg-gaming-primary/10 border border-gaming-primary/20 text-gaming-primary rounded-xl">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-sm text-white mb-2">Sobre o Projeto</h3>
            <p className="text-gaming-textMuted text-xs sm:text-sm leading-relaxed">
              A Happy Games Store nasceu com o objetivo de proporcionar uma experiência de compra simples, ágil e focada em oferecer as melhores opções de entretenimento digital.
            </p>
          </div>
        </div>
        <div className="bg-gaming-card border border-gaming-cardBorder p-6 rounded-2xl shadow-lg flex gap-4 items-start">
          <div className="p-3 bg-gaming-accent/10 border border-gaming-accent/20 text-gaming-accent rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-sm text-white mb-2">Nossa Missão</h3>
            <p className="text-gaming-textMuted text-xs sm:text-sm leading-relaxed">
              Conectar jogadores de todo o país aos seus títulos prediletos, minimizando atritos de pagamento e priorizando a transparência e usabilidade.
            </p>
          </div>
        </div>
        <div className="bg-gaming-card border border-gaming-cardBorder p-6 rounded-2xl shadow-lg flex gap-4 items-start">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-sm text-white mb-2">O Que Fazemos</h3>
            <p className="text-gaming-textMuted text-xs sm:text-sm leading-relaxed">
              Disponibilizamos um catálogo curado de jogos digitais multiplataforma, integrando algoritmos e dinâmicas de engajamento comunitário como rankings e gamificação.
            </p>
          </div>
        </div>
        <div className="bg-gaming-card border border-gaming-cardBorder p-6 rounded-2xl shadow-lg flex gap-4 items-start">
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-sm text-white mb-2">Valores</h3>
            <p className="text-gaming-textMuted text-xs sm:text-sm leading-relaxed">
              Valorizamos o respeito à privacidade dos dados, a acessibilidade das interfaces digitais, e a satisfação absoluta de cada membro da nossa comunidade.
            </p>
          </div>
        </div>
      </div>
      {/* Novidades da Comunidade section */}
      <div className="bg-gaming-card border border-gaming-cardBorder p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gaming-cardBorder">
          <Newspaper className="w-5 h-5 text-gaming-primary" />
          <h2 className="font-orbitron font-bold text-sm text-white">Novidades da Comunidade</h2>
        </div>
        <p className="text-gaming-textLight text-sm leading-relaxed bg-gaming-bg p-4 rounded-xl border border-gaming-cardBorder min-h-[72px]">
          {novidadesComunidade[novidadeAtual]}
        </p>
        <div className="flex items-center justify-between">
          <button onClick={proximaNovidade}
            className="flex items-center gap-1.5 border border-gaming-primary/30 hover:border-gaming-primary bg-gaming-primary/10 hover:bg-gaming-primary text-gaming-textLight hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Ver próxima novidade</span>
          </button>
          <span className="font-orbitron font-extrabold text-xs text-gaming-textMuted bg-gaming-bg px-3 py-1.5 rounded-lg border border-gaming-cardBorder">
            {novidadeAtual + 1} / {novidadesComunidade.length}
          </span>
        </div>
      </div>
      {/* Ranking section */}
      <div className="bg-gaming-card border border-gaming-cardBorder p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gaming-cardBorder">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gaming-accent animate-bounce" />
            <h2 className="font-orbitron font-bold text-sm text-white">Ranking da Semana</h2>
          </div>
          <span className="text-xxs text-gaming-textMuted italic">Pontuação: p(c) = 100c + bônus</span>
        </div>
        <ul className="space-y-2">
          {rankingFinal.map((jogador, index) => {
            const score = calcularPontos(jogador);
            return (
              <li key={jogador.nome}
                className="flex items-center justify-between p-3 bg-gaming-bg border border-gaming-cardBorder rounded-xl hover:border-gaming-primary/45 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-orbitron font-extrabold text-sm text-gaming-accent w-6 text-center">
                    {obterMedalha(index)}
                  </span>
                  <span className="text-gaming-textLight text-sm font-bold">{jogador.nome}</span>
                </div>
                <span className="bg-gaming-primary text-white font-orbitron font-extrabold text-xs px-3 py-1 rounded-full shadow-neon">
                  {score} pts
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Formulário e lista de membros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-gaming-card border border-gaming-cardBorder p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gaming-cardBorder">
            <UserPlus className="w-5 h-5 text-green-400" />
            <h2 className="font-orbitron font-bold text-sm text-white">Entre para a Comunidade</h2>
          </div>
          <p className="text-gaming-textMuted text-xs">Registre-se abaixo e veja seu nome na lista da sessão ao lado!</p>
          <form onSubmit={salvarMembro} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-xxs font-bold text-gaming-textLight mb-1 uppercase">Seu Nome</label>
              <input type="text" id="nome" value={campoNome} onChange={(e) => setCampoNome(e.target.value)}
                placeholder="Ex: João Silva"
                className={`w-full bg-gaming-bg border text-gaming-textLight text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${errosForm.nome ? 'border-red-500 focus:ring-red-500' : 'border-gaming-cardBorder focus:ring-gaming-primary focus:border-gaming-primary'}`} />
              {errosForm.nome && <p className="text-red-400 text-xxs mt-1 font-semibold">{errosForm.nome}</p>}
            </div>
            <div>
              <label htmlFor="jogo" className="block text-xxs font-bold text-gaming-textLight mb-1 uppercase">Jogo Favorito</label>
              <input type="text" id="jogo" value={campoJogo} onChange={(e) => setCampoJogo(e.target.value)}
                placeholder="Ex: God of War"
                className={`w-full bg-gaming-bg border text-gaming-textLight text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${errosForm.jogo ? 'border-red-500 focus:ring-red-500' : 'border-gaming-cardBorder focus:ring-gaming-primary focus:border-gaming-primary'}`} />
              {errosForm.jogo && <p className="text-red-400 text-xxs mt-1 font-semibold">{errosForm.jogo}</p>}
            </div>
            <div>
              <label htmlFor="senha" className="flex items-center gap-1 text-xxs font-bold text-gaming-textLight mb-1 uppercase">
                <Lock className="w-3 h-3" />
                <span>Crie uma senha</span>
              </label>
              <input type="password" id="senha" value={campoSenha} onChange={(e) => setCampoSenha(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className={`w-full bg-gaming-bg border text-gaming-textLight text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${errosForm.senha ? 'border-red-500 focus:ring-red-500' : 'border-gaming-cardBorder focus:ring-gaming-primary focus:border-gaming-primary'}`} />

              {/* barrinha de forca, so aparece depois que comeca a digitar */}
              {campoSenha && (
                <div className="mt-1.5">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`flex-1 rounded-full ${i <= forcaSenha.pontos ? forcaSenha.cor : 'bg-gaming-cardBorder'}`}></div>
                    ))}
                  </div>
                  <p className={`text-xxs mt-1 font-semibold ${forcaSenha.texto}`}>Força: {forcaSenha.nivel}</p>
                </div>
              )}
              {errosForm.senha && <p className="text-red-400 text-xxs mt-1 font-semibold">{errosForm.senha}</p>}
              <p className="text-gaming-textMuted text-xxs mt-1">Sua senha não fica salva em nenhum lugar, é usada só pra validar aqui na hora.</p>
            </div>
            {mensagemOk && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl flex items-center gap-2 text-xxs font-semibold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{mensagemOk}</span>
              </div>
            )}
            <button type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all hover:scale-102 active:scale-98">
              Cadastrar na comunidade
            </button>
          </form>
        </div>
        {listaMembros.length > 0 && (
          <div className="bg-gaming-card border border-gaming-cardBorder p-6 rounded-2xl shadow-lg space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 pb-3 border-b border-gaming-cardBorder">
              <Users className="w-5 h-5 text-gaming-primary" />
              <h2 className="font-orbitron font-bold text-sm text-white">Membros da Sessão</h2>
            </div>
            <p className="text-gaming-textMuted text-xs">Membros cadastrados localmente nesta navegação:</p>
            <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {desenharListaMembros()}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
