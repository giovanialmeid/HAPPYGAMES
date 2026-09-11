import { jogos } from '@/data/jogos';

export async function GET() {
  return Response.json(jogos);
}
