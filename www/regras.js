// Regras puras do Pulp Pot: sem DOM e sem física, para rodar no navegador e nos testes (Node).
const Regras = (() => {
  const FRUTAS = [
    { id: 'acai', r: 15, cor: '#4B1D52' }, { id: 'jabuticaba', r: 20, cor: '#2A1530' }, { id: 'acerola', r: 26, cor: '#E53935' },
    { id: 'caju', r: 32, cor: '#F57C00' }, { id: 'goiaba', r: 39, cor: '#9CCC65' }, { id: 'maracuja', r: 47, cor: '#F9C80E' },
    { id: 'manga', r: 56, cor: '#FFA726' }, { id: 'abacaxi', r: 66, cor: '#F4B400' }, { id: 'jaca', r: 77, cor: '#8DBA43' },
    { id: 'melancia', r: 90, cor: '#2E7D32' }];
  const PONTOS = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
  const ULTIMA = FRUTAS.length - 1, SOLTAVEIS = 5;

  const pontosFusao = k => PONTOS[k] * 2 + (k === ULTIMA ? 100 : 0); // duas melancias somem com bônus
  const sorteiaFruta = rand => rand() < 0.3 ? 0 : Math.min(SOLTAVEIS - 1, Math.floor(rand() * SOLTAVEIS));

  // metas: 3 fixas que ensinam, depois sobem a cada 3 árvores; da 11ª em diante, rodízio das mais difíceis
  const F = k => ({ tipo: 'fruta', k }), P = alvo => ({ tipo: 'pontos', alvo });
  const TABELA = [F(3), F(4), F(5), F(6), P(600), F(6), F(7), P(1200), F(7), F(8)];
  const RODIZIO = [F(7), P(1500), F(8), P(2000)];
  const metaPara = n => ({ ...(n < TABELA.length ? TABELA[n] : RODIZIO[(n - TABELA.length) % RODIZIO.length]) });
  const metaCumprida = (meta, { maior, pontos }) => meta.tipo === 'fruta' ? maior >= meta.k : pontos >= meta.alvo;

  // partida salva: só volta se estiver íntegra e na versão certa; qualquer coisa estranha vira "começar do zero"
  const serializa = p => JSON.stringify(p);
  const inteiro = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;
  function restaura(t) {
    let p;
    try { p = JSON.parse(t); } catch (e) { return null; }
    if (!p || p.v !== 1 || !Array.isArray(p.frutas)) return null;
    const frutasOk = p.frutas.every(f => f && inteiro(f.k, 0, ULTIMA) && Number.isFinite(f.x) && Number.isFinite(f.y));
    if (!frutasOk || !Number.isFinite(p.pontos) || p.pontos < 0 || !inteiro(p.maior, 0, ULTIMA)
      || !inteiro(p.atual, 0, SOLTAVEIS - 1) || !inteiro(p.prox, 0, SOLTAVEIS - 1) || typeof p.metaFeita !== 'boolean') return null;
    return { v: 1, frutas: p.frutas.map(({ k, x, y }) => ({ k, x, y })), pontos: p.pontos, maior: p.maior, atual: p.atual, prox: p.prox, metaFeita: p.metaFeita };
  }

  // pote transbordou: alguma fruta que já caiu há um tempo, está parada e passou da linha
  const transbordou = (frutas, linha) => frutas.some(f => f.idade > 1200 && f.y - f.r < linha && f.vel < 0.6);

  return { FRUTAS, PONTOS, pontosFusao, sorteiaFruta, metaPara, metaCumprida, serializa, restaura, transbordou };
})();
if (typeof module !== 'undefined') module.exports = Regras;
