"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCarrinho } from '@/context/CarrinhoContext';
import { Gamepad2, Home, LayoutGrid, ShoppingCart, Info, Menu, X } from 'lucide-react';

// barra de navegação principal do site
export default function Navbar() {
  const { totalItens, carregado } = useCarrinho();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  // lista dos links do menu
  const itensMenu = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Catálogo', href: '/catalogo', icon: LayoutGrid },
    { name: 'Comprar', href: '/compra', icon: ShoppingCart },
    { name: 'Sobre', href: '/sobre', icon: Info },
  ];

  // função pra abrir ou fechar o menu mobile
  const abrirFecharMenu = () => setMenuAberto(!menuAberto);

  return (
    <nav className="fixed top-[28px] sm:top-[36px] left-0 w-full z-50 bg-gaming-bg/90 backdrop-blur-md border-b border-gaming-cardBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 font-orbitron text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gaming-primary to-purple-400 hover:opacity-95 transition-all">
              <Gamepad2 className="w-7 h-7 text-gaming-primary" />
              <span>Happy Games</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {itensMenu.map((link) => {
              const Icon = link.icon;
              const ativo = pathname === link.href;
              return (
                <Link key={link.name} href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    ativo ? 'bg-gaming-primary text-white shadow-neon' : 'text-gaming-textMuted hover:text-gaming-textLight hover:bg-gaming-card/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <Link href="/carrinho"
              className={`relative p-2.5 rounded-lg transition-all ${
                pathname === '/carrinho' ? 'bg-gaming-accent text-white shadow-neonAmber' : 'bg-gaming-card text-gaming-textLight border border-gaming-cardBorder hover:border-gaming-primary hover:text-gaming-primary'
              }`}
              title="Ver Carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              {carregado && totalItens > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gaming-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border border-gaming-bg animate-pulse">
                  {totalItens}
                </span>
              )}
            </Link>
          </div>
          <div className="flex md:hidden items-center gap-4">
            <Link href="/carrinho" className="relative p-2 bg-gaming-card rounded-lg border border-gaming-cardBorder">
              <ShoppingCart className="w-5 h-5 text-gaming-textLight" />
              {carregado && totalItens > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gaming-primary text-white text-xxs font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border border-gaming-bg">
                  {totalItens}
                </span>
              )}
            </Link>
            <button onClick={abrirFecharMenu}
              className="p-2 bg-gaming-card border border-gaming-cardBorder rounded-lg text-gaming-textMuted hover:text-gaming-textLight focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {menuAberto && (
        <div className="md:hidden bg-gaming-bg/95 border-b border-gaming-cardBorder animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {itensMenu.map((link) => {
              const Icon = link.icon;
              const ativo = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    ativo ? 'bg-gaming-primary text-white shadow-neon' : 'text-gaming-textMuted hover:text-gaming-textLight hover:bg-gaming-card'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
