// Catalogo de jogos da Happy Games.
// Fica num arquivo separado porque tanto a API de jogos (api/games) quanto a
// API de recomendacao com IA (api/recomendar) precisam dessa mesma lista.
// Antes essa lista vivia dentro de api/games/route.js, mas duplicar ela na
// rota nova ia gerar o mesmo problema que a gente já corrigiu com o
// CartContext.js: duas fontes com a mesma informação, uma delas ia
// desatualizar sem a gente perceber.
export const jogos = [
  {
    id: 1,
    nome: "The Last Of Us",
    genero: "Sobrevivência",
    plataforma: "PS5",
    preco: 199.90,
    imagem: "/images/TLOU.jpg",
    descricao: "Aventura e sobrevivência em um mundo pós-apocalíptico com narrativa emocionante."
  },
  {
    id: 2,
    nome: "GTA 6",
    genero: "Mundo Aberto",
    plataforma: "PS5 Xbox",
    preco: 349.90,
    imagem: "/images/GTA.jpg",
    descricao: "Mundo aberto com missões, ação intensa e liberdade para explorar uma cidade cheia de possibilidades."
  },
  {
    id: 3,
    nome: "Fortnite",
    genero: "Battle Royale",
    plataforma: "PC Xbox",
    preco: 149.90,
    imagem: "/images/FORT.jpg",
    descricao: "Batalhas rápidas, construção estratégica e eventos sazonais com muito conteúdo competitivo."
  },
  {
    id: 4,
    nome: "EA Sports FC 26",
    genero: "Esporte",
    plataforma: "PC Xbox",
    preco: 249.90,
    imagem: "/images/FC26.jpg",
    descricao: "Simulação de futebol com modos online e carreira para quem quer jogar com os maiores clubes do mundo."
  },
  {
    id: 5,
    nome: "Minecraft",
    genero: "Sandbox",
    plataforma: "PC",
    preco: 99.90,
    imagem: "/images/MINE.jpg",
    descricao: "Crie, explore e sobreviva em um universo de blocos com infinitas possibilidades de construção."
  },
  {
    id: 6,
    nome: "God of War Ragnarök",
    genero: "Ação",
    plataforma: "PS5 PC",
    preco: 299.90,
    imagem: "/images/GOW.jpg",
    descricao: "Ação cinematográfica com combates intensos e história épica na mitologia nórdica."
  }
];
