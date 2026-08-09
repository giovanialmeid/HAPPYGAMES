"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Type, Volume2, VolumeX } from 'lucide-react';

// barra de acessibilidade que fica no topo da página
export default function AccessibilityBar() {
  const [modoContraste, setModoContraste] = useState(false);
  const [tamanhoTexto, setTamanhoTexto] = useState('normal');
  const [narradorLigado, setNarradorLigado] = useState(false);

  // carrega as preferências salvas no localStorage quando a página abre
  useEffect(() => {
    const contrasteSalvo = localStorage.getItem('sc_alto_contraste') === 'true';
    const fonteSalva = localStorage.getItem('sc_font_size') || 'normal';
    const narradorSalvo = localStorage.getItem('sc_voz_ativa') === 'true';
    setModoContraste(contrasteSalvo);
    setTamanhoTexto(fonteSalva);
    setNarradorLigado(narradorSalvo);
    const body = document.body;
    if (contrasteSalvo) body.classList.add('alto-contraste');
    body.classList.remove('font-lg', 'font-xl');
    if (fonteSalva === 'lg') body.classList.add('font-lg');
    if (fonteSalva === 'xl') body.classList.add('font-xl');
  }, []);

  // escuta os cliques pra narrar o texto quando o narrador tá ligado
  useEffect(() => {
    const cliqueNarrador = (e) => {
      if (!narradorLigado) return;
      let element = e.target;
      while (element && element !== document.body) {
        if (element.hasAttribute('data-narrar') || element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
          const text = element.getAttribute('data-narrar') || element.textContent;
          narrar(text);
          break;
        }
        element = element.parentElement;
      }
    };
    document.body.addEventListener('click', cliqueNarrador);
    return () => { document.body.removeEventListener('click', cliqueNarrador); };
  }, [narradorLigado]);

  // usa a API de síntese de voz pra falar o texto
  const narrar = (mensagem) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(mensagem);
      fala.lang = 'pt-BR';
      fala.rate = 1.1;
      window.speechSynthesis.speak(fala);
    }
  };

  // só narra se o narrador estiver ativado
  const narrarSeAtivado = (mensagem, checkState = narradorLigado) => {
    if (checkState) { narrar(mensagem); }
  };

  // liga ou desliga o modo de alto contraste
  const mudarContraste = () => {
    const novoContraste = !modoContraste;
    setModoContraste(novoContraste);
    localStorage.setItem('sc_alto_contraste', novoContraste.toString());
    if (novoContraste) { document.body.classList.add('alto-contraste'); }
    else { document.body.classList.remove('alto-contraste'); }
    narrarSeAtivado("Modo de contraste alterado.");
  };

  // volta o tamanho do texto pro padrão
  const resetarFonte = () => {
    setTamanhoTexto('normal');
    localStorage.setItem('sc_font_size', 'normal');
    document.body.classList.remove('font-lg', 'font-xl');
    narrarSeAtivado("Tamanho da letra voltou ao normal.");
  };

  // aumenta o tamanho do texto (normal -> lg -> xl)
  const aumentarTexto = () => {
    let novoTamanho = 'normal';
    if (tamanhoTexto === 'normal') { novoTamanho = 'lg'; }
    else if (tamanhoTexto === 'lg') { novoTamanho = 'xl'; }
    else { novoTamanho = 'xl'; }
    setTamanhoTexto(novoTamanho);
    localStorage.setItem('sc_font_size', novoTamanho);
    document.body.classList.remove('font-lg', 'font-xl');
    if (novoTamanho === 'lg') document.body.classList.add('font-lg');
    if (novoTamanho === 'xl') document.body.classList.add('font-xl');
    narrarSeAtivado("Tamanho da letra aumentado.");
  };

  // liga ou desliga o narrador de voz
  const mudarNarrador = () => {
    const novaVoz = !narradorLigado;
    setNarradorLigado(novaVoz);
    localStorage.setItem('sc_voz_ativa', novaVoz.toString());
    if (novaVoz) { narrar("Leitor de voz ligado. Clique nas informações ou botões para ouvir."); }
    else { window.speechSynthesis.cancel(); }
  };

  return (
    <div className="bg-[#04060c] border-b border-white/10 py-1.5 px-4 text-xs z-50 fixed top-0 w-full select-none"
      role="complementary" aria-label="Barra de Acessibilidade">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-white/60 font-bold">Acessibilidade Digital:</span>
          <button onClick={mudarContraste}
            className="flex items-center gap-1 bg-black text-white border border-white/20 hover:border-indigo-500 rounded px-2.5 py-1 text-xxs font-bold uppercase transition-all"
            aria-label="Alternar modo de alto contraste">
            <Eye className="w-3 h-3" />
            <span>{modoContraste ? "Contraste Normal" : "Alto Contraste"}</span>
          </button>
          <button onClick={mudarNarrador}
            className="flex items-center gap-1 bg-black text-white border border-white/20 hover:border-indigo-500 rounded px-2.5 py-1 text-xxs font-bold uppercase transition-all"
            aria-label="Alternar leitor de voz">
            {narradorLigado ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            <span>{narradorLigado ? "Desativar Voz" : "Ouvir Tela"}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60 font-bold">Tamanho do Texto:</span>
          <button onClick={resetarFonte}
            className="bg-black text-white border border-white/20 hover:border-indigo-500 rounded px-2 py-0.5 text-xs font-bold transition-all"
            aria-label="Redefinir tamanho da fonte para o padrão">A</button>
          <button onClick={aumentarTexto} disabled={tamanhoTexto === 'xl'}
            className="bg-black text-white border border-white/20 hover:border-indigo-500 rounded px-2 py-0.5 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Aumentar tamanho do texto">A+</button>
        </div>
      </div>
    </div>
  );
}
