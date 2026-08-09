import './globals.css';
import { CarrinhoProvider } from '@/context/CarrinhoContext';
import AccessibilityBar from '@/components/AccessibilityBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// informações da página pro SEO
export const metadata = {
  title: 'Happy Games - Loja de Jogos Digitais',
  description: 'Loja online de jogos digitais feita com React e Next.js para o projeto da FIAP.',
  keywords: 'games, jogos, loja de jogos, fiap, happy games, react, next.js, tailwind',
};

// componente principal que envolve toda a aplicação
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <CarrinhoProvider>
          <AccessibilityBar />
          <Navbar />
          <main className="flex-grow pt-24" id="main-content">
            {children}
          </main>
          <Footer />
        </CarrinhoProvider>
      </body>
    </html>
  );
}
