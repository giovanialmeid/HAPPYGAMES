# Happy Games

Loja de jogos desenvolvida como projeto do Enterprise Challenge (FIAP), pelo Grupo 5, com
mentoria de cybersegurança da Palo Alto Networks.

O projeto passou por várias fases: começou em HTML/CSS/JS puro (pastas `HTML`, `CSS`,
`JavaScript`, `Imagens`, mantidas aqui como histórico) e evoluiu pra uma versão em React/Next.js
(pasta `happy-games-react`), que é a versão atual e funcional do produto.

## O que o projeto tem

* Catálogo de jogos com filtros
* Carrinho de compras com desconto progressivo
* Simulação de checkout (compra → recibo)
* Cadastro de comunidade com validação de força de senha
* **Recomendação de jogos por Inteligência Artificial** (API do Google Gemini), restrita ao
próprio catálogo da loja pra nunca recomendar um jogo que não existe
* Cuidados de segurança (validação de senha forte, dados sensíveis fora da URL, auditoria de dependências com npm audit e conformidade com a LGPD)

## Tecnologias

* Next.js 14 (App Router)
* React 18
* Tailwind CSS
* API do Google Gemini (recomendação por IA)

## Como rodar o projeto

O projeto que roda é o que está dentro da pasta `happy-games-react`.

### 1\) Pré-requisito

Ter o [Node.js](https://nodejs.org) instalado (versão 18 ou mais recente).

### 2\) Instalar as dependências

```bash
cd happy-games-react
npm install
```

### 3\) Configurar a chave de IA (opcional, mas recomendado)

A recomendação de jogos por IA precisa de uma chave gratuita do Google Gemini. Sem ela, o resto
do site funciona normalmente, só essa funcionalidade específica que fica desativada.

1. Entre em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) e faça
login com uma conta Google (não pede cartão de crédito).
2. Clique em "Create API key" e copie a chave gerada.
3. Dentro da pasta `happy-games-react`, crie um arquivo chamado `.env.local` com o conteúdo:

```
GEMINI\_API\_KEY=sua\_chave\_aqui
```

### 4\) Rodar em modo de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### 5\) Gerar a versão de produção (opcional)

```bash
npm run build
npm start
```

## Estrutura do projeto (happy-games-react)

```
src/
  app/
    api/
      games/route.js        -> lista o catálogo de jogos
      recomendar/route.js   -> recomendação de jogos por IA
    catalogo/page.js        -> página do catálogo
    carrinho/page.js        -> carrinho de compras
    compra/page.js          -> checkout
    sobre/page.js           -> cadastro de comunidade + validação de senha
  components/                -> componentes reutilizáveis (GameCard, RecomendacaoIA etc.)
  data/jogos.js               -> catálogo de jogos (fonte única de dados)
```

## Segurança e Boas Práticas

O projeto foi orientado por mentoria de cybersegurança da Palo Alto Networks:
* **Complexidade de senha:** Validação em tempo real com Regex (mínimo 8 caracteres, maiúscula, número e caractere especial) e feedback visual de força.
* **Proteção de dados e LGPD:** Senhas e dados de cartão nunca são salvos e não trafegam pela URL (ficam apenas no estado do React para simulação e são descartados).
* **Anti-alucinação de IA:** A API do Gemini recebe apenas o catálogo existente e o backend valida se o ID devolvido realmente faz parte da loja.
* **Segurança de credenciais:** Chaves de API mantidas exclusivamente no ambiente do servidor via `.env.local`, protegidas pelo `.gitignore`.

