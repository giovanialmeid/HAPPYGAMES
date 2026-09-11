import { jogos } from '@/data/jogos';

// Rota de recomendacao de jogos usando IA (API do Google Gemini).
// A pessoa manda uma frase dizendo que tipo de jogo ela quer, a IA olha
// pro nosso catalogo e devolve UM jogo que ja existe na loja.
//
// Usamos o Gemini porque ele tem plano gratuito de verdade (sem cartao de
// credito), diferente de outros provedores de IA.
//
// Cuidados que a gente tomou aqui (documentados tambem no SEGURANCA.txt):
// 1) So mandamos a pergunta da pessoa pra API, nada de nome, email ou
//    qualquer outro dado pessoal.
// 2) A IA so pode escolher um id que esteja na nossa lista de jogos. Isso
//    e falado no prompt, mas o codigo tambem confere depois, porque IA
//    pode "alucinar" e inventar um jogo que a gente nem vende.
export async function POST(request) {
  const body = await request.json();
  const pergunta = (body.pergunta || '').trim();

  if (!pergunta) {
    return Response.json({ erro: 'Escreva o que você está procurando.' }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { erro: 'A recomendação por IA não está configurada. Falta a chave de API no .env.local.' },
      { status: 500 }
    );
  }

  // Monta uma lista enxuta do catalogo pra IA nao receber informacao demais
  const catalogoResumido = jogos.map(function (jogo) {
    return { id: jogo.id, nome: jogo.nome, genero: jogo.genero, descricao: jogo.descricao };
  });

  const promptSistema =
    'Você recomenda jogos de uma loja chamada Happy Games. ' +
    'Você SÓ pode escolher um jogo da lista de catálogo abaixo, nunca invente um jogo que não está nela. ' +
    'Catálogo: ' + JSON.stringify(catalogoResumido) + '. ' +
    'Responda SOMENTE em JSON, no formato {"id": numero, "motivo": "texto curto explicando a escolha"}, sem nenhum texto fora do JSON.';

  const modelo = 'gemini-3.6-flash';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelo + ':generateContent';

  try {
    const respostaIA = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: promptSistema }] },
        contents: [{ parts: [{ text: pergunta }] }],
        generationConfig: { responseMimeType: 'application/json', thinkingConfig: { thinkingLevel: 'minimal' } }
      })
    });

    if (!respostaIA.ok) {
      const detalheErro = await respostaIA.text();
      console.error('Gemini respondeu com erro:', respostaIA.status, detalheErro);
      return Response.json({ erro: 'Não consegui falar com a IA agora, tenta de novo.' }, { status: 502 });
    }

    const dadosIA = await respostaIA.json();
    const textoResposta = dadosIA.candidates[0].content.parts[0].text;
    const escolha = JSON.parse(textoResposta);

    // Confere se o id que a IA devolveu realmente existe no catalogo.
    // Isso evita mostrar pro usuario um jogo que a gente nao vende.
    const jogoEscolhido = jogos.find(function (jogo) { return jogo.id === escolha.id; });
    if (!jogoEscolhido) {
      return Response.json({ erro: 'A IA sugeriu um jogo fora do nosso catálogo, tenta perguntar de outro jeito.' }, { status: 502 });
    }

    return Response.json({ jogo: jogoEscolhido, motivo: escolha.motivo });
  } catch (err) {
    console.error('Erro na recomendação por IA:', err);
    return Response.json({ erro: 'Algo deu errado ao gerar a recomendação.' }, { status: 500 });
  }
}
