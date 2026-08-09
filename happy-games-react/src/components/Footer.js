import React from 'react';
import { Gamepad2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gaming-bg border-t border-gaming-cardBorder py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-orbitron text-lg font-bold text-gaming-textLight">
            <Gamepad2 className="w-6 h-6 text-gaming-primary" />
            <span>Happy Games</span>
          </div>
          
          <div className="flex items-center gap-2 text-gaming-textMuted hover:text-gaming-textLight transition-colors">
            <Mail className="w-4 h-4" />
            <span>Email: <a href="mailto:contato@happygames.com" className="underline">contato@happygames.com</a></span>
          </div>
          
          <p className="text-gaming-textMuted text-sm">
            &copy; {new Date().getFullYear()} Happy Games. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
