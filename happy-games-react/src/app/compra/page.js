"use client";

// Pagina de finalizar compra - formulario dividido em 3 etapas
// Os jogos vem do carrinho, aqui a pessoa so confere e paga
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCarrinho } from '@/context/CarrinhoContext';
import { User, ShieldCheck, CreditCard, ShoppingCart, ShoppingBag, ArrowLeft, ArrowRight, CheckCircle, Plus, Minus } from 'lucide-react';

export default function Compra() {
  const router = useRouter();
  const {
    carrinho,
    totalItens,
    subtotal,
    porcentagemDesconto,
    economiaValor,
    totalFinal,
    mudarQuantidade,
    limparTudo,
    carregado
  } = useCarrinho();

  // Etapa atual do stepper (1, 2 ou 3)
  const [etapa, setEtapa] = useState(1);

  // Dados que o usuário preenche no formulário
  const [dadosForm, setDadosForm] = useState({
    nome: '',
    email: '',
    cartao: '',
    validade: '',
    cvv: ''
  });

  // Erros de validação dos campos
  const [erros, setErros] = useState({});
  // Controla se mostra o modal de confirmação
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  // Sem isso a tela de "carrinho vazio" pisca na hora que limpo o carrinho pra ir
  // pra pagina de obrigado. Ficou feio, entao criei esse controle.
  const [finalizando, setFinalizando] = useState(false);

  // Formata valor em reais (R$)
  const formatarPreco = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Quando o usuário digita em qualquer campo do formulário
  const digitarCampo = (e) => {
    const { id, value } = e.target;
    setDadosForm(prev => ({
      ...prev,
      [id]: value
    }));
    // Limpa o erro do campo quando começa a digitar
    if (erros[id]) {
      setErros(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Máscara pro número do cartão: coloca espaço a cada 4 dígitos
  const mascaraCartao = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setDadosForm(prev => ({ ...prev, cartao: val }));
    if (erros.cartao) setErros(prev => ({ ...prev, cartao: '' }));
  };

  // Máscara pra validade: formato MM/AA
  const mascaraValidade = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setDadosForm(prev => ({ ...prev, validade: val }));
    if (erros.validade) setErros(prev => ({ ...prev, validade: '' }));
  };

  // Máscara pro CVV: só 3 números
  const mascaraCvv = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 3);
    setDadosForm(prev => ({ ...prev, cvv: val }));
    if (erros.cvv) setErros(prev => ({ ...prev, cvv: '' }));
  };

  // Checa se os campos da etapa atual tão preenchidos certinho
  const checarFormulario = (numEtapa) => {
    const newErrors = {};
    if (numEtapa === 1) {
      if (!dadosForm.nome.trim()) {
        newErrors.nome = 'Digite seu nome completo.';
      }
      if (!dadosForm.email.trim()) {
        newErrors.email = 'Digite seu e-mail.';
      } else if (!/\S+@\S+\.\S+/.test(dadosForm.email)) {
        newErrors.email = 'Digite um e-mail válido.';
      }
    } else if (numEtapa === 3) {
      const cardClean = dadosForm.cartao.replace(/\s/g, '');
      if (cardClean.length < 16) {
        newErrors.cartao = 'O cartão de crédito deve conter 16 dígitos.';
      }
      if (!dadosForm.validade.trim() || dadosForm.validade.length < 5) {
        newErrors.validade = 'Preencha a validade (MM/AA).';
      }
      if (!dadosForm.cvv.trim() || dadosForm.cvv.length < 3) {
        newErrors.cvv = 'Preencha o CVV com 3 dígitos.';
      }
    }

    setErros(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avança pro próximo passo se tá tudo certo
  const proximoPasso = () => {
    if (checarFormulario(etapa)) {
      setEtapa(prev => prev + 1);
    }
  };

  // Volta pro passo anterior
  const voltarPasso = () => {
    setEtapa(prev => prev - 1);
  };

  // Abre o modal de revisão do pedido
  const abrirRevisao = (e) => {
    e.preventDefault();
    if (checarFormulario(3)) {
      setMostrarConfirmacao(true);
    }
  };

  // Confirma a compra, limpa o carrinho e redireciona
  const finalizarPedido = () => {
    // Junta o nome dos jogos pra mostrar no recibo
    const nomesJogos = carrinho.map(item => item.nome).join(', ');

    const params = new URLSearchParams({
      nome: dadosForm.nome,
      email: dadosForm.email,
      jogo: nomesJogos,
      quantidade: totalItens.toString(),
      desconto: economiaValor.toString(),
      total: totalFinal.toString()
    });

    // Marca antes de limpar pra tela nao piscar
    setFinalizando(true);
    limparTudo();
    router.push(`/obrigado?${params.toString()}`);
  };

  // Espera o carrinho carregar, senao o Next reclama de hydration
  if (!carregado) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-gaming-textMuted">Carregando seu pedido...</p>
      </div>
    );
  }

  // Nao da pra finalizar compra com o carrinho vazio
  if (carrinho.length === 0 && !finalizando) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-gaming-card border border-gaming-cardBorder rounded-3xl p-8 md:p-12 shadow-xl">
          <ShoppingBag className="w-16 h-16 text-gaming-textMuted mx-auto mb-4" />
          <h1 className="font-orbitron font-extrabold text-2xl text-white mb-2">Finalizar Compra</h1>
          <p className="text-gaming-textMuted text-sm max-w-sm mx-auto mb-6">
            Seu carrinho está vazio. Escolha alguns jogos no catálogo antes de finalizar a compra!
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

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-gaming-card border border-gaming-cardBorder rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">

        <h1 className="font-orbitron font-black text-xl md:text-2xl text-center text-white mb-6">
          Finalizar Compra
        </h1>

        {/* Barra de progresso do stepper */}
        <div className="mb-8">
          <div className="w-full bg-gaming-bg h-2.5 rounded-full overflow-hidden mb-3.5 border border-gaming-cardBorder">
            <div
              className="bg-gaming-primary h-full transition-all duration-300 shadow-neon"
              style={{ width: `${(etapa / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xxs font-orbitron font-bold text-gaming-textMuted uppercase tracking-wider">
            <span className={etapa >= 1 ? 'text-gaming-primary' : ''}>Dados Pessoais</span>
            <span className={etapa >= 2 ? 'text-gaming-primary' : ''}>Pedido</span>
            <span className={etapa >= 3 ? 'text-gaming-primary' : ''}>Pagamento</span>
          </div>
        </div>

        {/* ETAPA 1: DADOS PESSOAIS */}
        {etapa === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="font-orbitron font-bold text-sm text-gaming-textLight flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gaming-primary" />
              <span>Dados de Identificação</span>
            </h2>

            <div>
              <label htmlFor="nome" className="block text-xs font-bold text-gaming-textLight mb-1.5 uppercase">Nome completo</label>
              <input
                type="text"
                id="nome"
                value={dadosForm.nome}
                onChange={digitarCampo}
                placeholder="Ex: João da Silva"
                className={`w-full bg-gaming-bg border text-gaming-textLight text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 ${
                  erros.nome ? 'border-red-500 focus:ring-red-500' : 'border-gaming-cardBorder focus:ring-gaming-primary focus:border-gaming-primary'
                }`}
              />
              {erros.nome && <p className="text-red-400 text-xxs mt-1 font-semibold">{erros.nome}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gaming-textLight mb-1.5 uppercase">E-mail</label>
              <input
                type="email"
                id="email"
                value={dadosForm.email}
                onChange={digitarCampo}
                placeholder="seuemail@exemplo.com"
                className={`w-full bg-gaming-bg border text-gaming-textLight text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 ${
                  erros.email ? 'border-red-500 focus:ring-red-500' : 'border-gaming-cardBorder focus:ring-gaming-primary focus:border-gaming-primary'
                }`}
              />
              {erros.email && <p className="text-red-400 text-xxs mt-1 font-semibold">{erros.email}</p>}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={proximoPasso}
                className="flex items-center gap-1 bg-gaming-primary hover:bg-gaming-primaryHover text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-neon"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: CONFERIR OS ITENS DO CARRINHO */}
        {etapa === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="font-orbitron font-bold text-sm text-gaming-textLight flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-gaming-primary" />
              <span>Conferir Pedido</span>
            </h2>

            <p className="text-gaming-textMuted text-xs">
              Esses são os jogos do seu carrinho. Dá pra ajustar a quantidade aqui mesmo.
            </p>

            {/* jogos que vieram do carrinho */}
            <div className="space-y-2">
              {carrinho.map((item) => (
                <div key={item.nome}
                  className="flex items-center justify-between gap-3 bg-gaming-bg border border-gaming-cardBorder p-3 rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imagem} alt={item.nome}
                    className="w-12 h-12 object-cover rounded-lg border border-gaming-cardBorder flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-orbitron font-bold text-xs text-white truncate">{item.nome}</h3>
                    <p className="text-gaming-textMuted text-xxs">{formatarPreco(item.preco)} unit.</p>
                  </div>
                  <div className="flex items-center gap-1 bg-gaming-card border border-gaming-cardBorder rounded-lg p-1 flex-shrink-0">
                    <button type="button" onClick={() => mudarQuantidade(item.nome, item.quantidade - 1)}
                      className="p-1 hover:bg-gaming-cardBorder rounded text-gaming-textMuted hover:text-white" title="Diminuir">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-orbitron font-bold text-xs text-white px-1.5">{item.quantidade}</span>
                    <button type="button" onClick={() => mudarQuantidade(item.nome, item.quantidade + 1)}
                      className="p-1 hover:bg-gaming-cardBorder rounded text-gaming-textMuted hover:text-white" title="Aumentar">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* resumo dos valores */}
            <div className="bg-gaming-bg border border-gaming-cardBorder rounded-2xl p-4 space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gaming-textMuted font-medium">Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'})</span>
                <span className="text-white font-bold">{formatarPreco(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-green-400">
                <span className="flex items-center gap-1 font-medium">
                  <span>Desconto ({porcentagemDesconto}%)</span>
                  <span className="text-xxs opacity-75">d(n)=5n</span>
                </span>
                <span className="font-bold">-{formatarPreco(economiaValor)}</span>
              </div>
              <div className="border-t border-gaming-cardBorder my-1"></div>
              <div className="flex items-center justify-between font-orbitron text-sm font-bold">
                <span className="text-gaming-textLight">Total Estimado</span>
                <span className="text-white">{formatarPreco(totalFinal)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={voltarPasso}
                className="flex items-center gap-1 border border-gaming-cardBorder hover:bg-gaming-cardBorder text-gaming-textLight text-xs font-bold px-5 py-3 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              <button
                type="button"
                onClick={proximoPasso}
                className="flex items-center gap-1 bg-gaming-primary hover:bg-gaming-primaryHover text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-neon"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: PAGAMENTO */}
        {etapa === 3 && (
          <form onSubmit={abrirRevisao} className="space-y-4 animate-fadeIn">
            <h2 className="font-orbitron font-bold text-sm text-gaming-textLight flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-gaming-primary" />
              <span>Dados de Pagamento</span>
            </h2>

            <div>
              <label htmlFor="cartao" className="block text-xs font-bold text-gaming-textLight mb-1.5 uppercase">Número do Cartão</label>
              <input
                type="text"
                id="cartao"
                placeholder="0000 0000 0000 0000"
                value={dadosForm.cartao}
                onChange={mascaraCartao}
                maxLength="19"
                className={`w-full bg-gaming-bg border text-gaming-textLight text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 ${
                  erros.cartao ? 'border-red-500 focus:ring-red-500' : 'border-gaming-cardBorder focus:ring-gaming-primary focus:border-gaming-primary'
                }`}
              />
              {erros.cartao && <p className="text-red-400 text-xxs mt-1 font-semibold">{erros.cartao}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="validade" className="block text-xs font-bold text-gaming-textLight mb-1.5 uppercase">Validade</label>
                <input
                  type="text"
                  id="validade"
                  placeholder="MM/AA"
                  value={dadosForm.validade}
                  onChange={mascaraValidade}
                  maxLength="5"
                  className={`w-full bg-gaming-bg border text-gaming-textLight text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 ${
                    erros.validade ? 'border-red-500 focus:ring-red-500' : 'border-gaming-cardBorder focus:ring-gaming-primary focus:border-gaming-primary'
                  }`}
                />
                {erros.validade && <p className="text-red-400 text-xxs mt-1 font-semibold">{erros.validade}</p>}
              </div>

              <div>
                <label htmlFor="cvv" className="block text-xs font-bold text-gaming-textLight mb-1.5 uppercase">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="123"
                  value={dadosForm.cvv}
                  onChange={mascaraCvv}
                  maxLength="3"
                  className={`w-full bg-gaming-bg border text-gaming-textLight text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 ${
                    erros.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gaming-cardBorder focus:ring-gaming-primary focus:border-gaming-primary'
                  }`}
                />
                {erros.cvv && <p className="text-red-400 text-xxs mt-1 font-semibold">{erros.cvv}</p>}
              </div>
            </div>

            {/* aviso pro usuario de que o cartao nao fica salvo */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 flex gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-gaming-textMuted text-xxs leading-relaxed">
                Os dados do seu cartão são usados só para simular esta compra. Eles não são salvos,
                não vão para a URL e não são enviados para nenhum servidor.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={voltarPasso}
                className="flex items-center gap-1 border border-gaming-cardBorder hover:bg-gaming-cardBorder text-gaming-textLight text-xs font-bold px-5 py-3 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-gaming-accent hover:bg-gaming-accentHover text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-neonAmber hover:scale-103 active:scale-97"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Revisar pedido</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      {mostrarConfirmacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-gaming-card border border-gaming-cardBorder rounded-3xl p-6 shadow-2xl animate-fadeIn space-y-6">

            {/* Cabeçalho do modal */}
            <div className="flex items-center gap-2 pb-3 border-b border-gaming-cardBorder">
              <CheckCircle className="w-5 h-5 text-gaming-primary" />
              <h3 className="font-orbitron font-extrabold text-sm text-white">Revisar e Confirmar</h3>
            </div>

            {/* Dados da compra pro usuário conferir */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex justify-between">
                <span className="text-gaming-textMuted font-medium">Nome</span>
                <span className="text-white font-bold text-right">{dadosForm.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gaming-textMuted font-medium">E-mail</span>
                <span className="text-white font-bold text-right break-all">{dadosForm.email}</span>
              </div>

              <div className="border-t border-gaming-cardBorder my-2"></div>

              {/* os jogos da compra */}
              {carrinho.map((item) => (
                <div key={item.nome} className="flex justify-between">
                  <span className="text-gaming-textMuted font-medium">{item.nome}</span>
                  <span className="text-white font-bold text-right">
                    {item.quantidade}x {formatarPreco(item.preco * item.quantidade)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between text-green-400">
                <span className="font-medium">Desconto ({porcentagemDesconto}%)</span>
                <span className="font-bold text-right">-{formatarPreco(economiaValor)}</span>
              </div>

              <div className="border-t border-gaming-cardBorder my-2"></div>

              <div className="flex justify-between font-orbitron text-sm font-black">
                <span className="text-gaming-textLight">Total final</span>
                <span className="text-white">{formatarPreco(totalFinal)}</span>
              </div>
            </div>

            {/* Botões de editar ou confirmar */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setMostrarConfirmacao(false)}
                className="flex-1 border border-gaming-cardBorder hover:bg-gaming-cardBorder text-gaming-textLight text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                Editar
              </button>
              <button
                onClick={finalizarPedido}
                className="flex-1 bg-gaming-primary hover:bg-gaming-primaryHover text-white text-xs font-bold py-2.5 rounded-xl shadow-neon transition-all"
              >
                Confirmar compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
