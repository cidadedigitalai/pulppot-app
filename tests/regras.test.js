// Regras puras do Pulp Pot (sem DOM e sem física).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const R = require('../www/regras.js');

const seq = valores => { let i = 0; return () => valores[i++]; };

test('dez frutas na ordem certa, do açaí à melancia', () => {
  assert.deepEqual(R.FRUTAS.map(f => f.id), ['acai', 'jabuticaba', 'acerola', 'caju', 'goiaba', 'maracuja', 'manga', 'abacaxi', 'jaca', 'melancia']);
  assert.deepEqual(R.FRUTAS.map(f => f.r), [15, 20, 26, 32, 39, 47, 56, 66, 77, 90]);
  assert.ok(R.FRUTAS.every(f => /^#[0-9A-F]{6}$/i.test(f.cor)));
});

test('pontos da fusão: PONTOS[k]*2, e duas melancias ainda dão +100', () => {
  assert.deepEqual(R.PONTOS, [1, 3, 6, 10, 15, 21, 28, 36, 45, 55]);
  assert.equal(R.pontosFusao(0), 2);
  assert.equal(R.pontosFusao(6), 56);
  assert.equal(R.pontosFusao(9), 210);
});

test('sorteio: 30% açaí, senão uma das 5 primeiras', () => {
  assert.equal(R.sorteiaFruta(seq([0.1])), 0);
  assert.equal(R.sorteiaFruta(seq([0.5, 0.99])), 4);
  assert.equal(R.sorteiaFruta(seq([0.5, 0.0])), 0);
  for (let i = 0; i < 1000; i++) { const k = R.sorteiaFruta(Math.random); assert.ok(k >= 0 && k <= 4 && Number.isInteger(k)); }
});

test('tabela de metas das 10 primeiras árvores', () => {
  const F = k => ({ tipo: 'fruta', k }), P = alvo => ({ tipo: 'pontos', alvo });
  const esperado = [F(3), F(4), F(5), F(6), P(600), F(6), F(7), P(1200), F(7), F(8)];
  esperado.forEach((m, n) => assert.deepEqual(R.metaPara(n), m, `árvore ${n}`));
});

test('depois das 10 árvores as metas giram entre as mais difíceis', () => {
  const rodizio = [{ tipo: 'fruta', k: 7 }, { tipo: 'pontos', alvo: 1500 }, { tipo: 'fruta', k: 8 }, { tipo: 'pontos', alvo: 2000 }];
  for (let n = 10; n < 18; n++) assert.deepEqual(R.metaPara(n), rodizio[(n - 10) % 4], `árvore ${n}`);
});

test('a meta nunca se repete duas vezes seguidas', () => {
  for (let n = 1; n <= 30; n++) assert.notDeepEqual(R.metaPara(n), R.metaPara(n - 1), `árvores ${n - 1} e ${n}`);
});

test('meta cumprida por fruta criada ou por pontos', () => {
  assert.equal(R.metaCumprida({ tipo: 'fruta', k: 6 }, { maior: 6, pontos: 0 }), true);
  assert.equal(R.metaCumprida({ tipo: 'fruta', k: 6 }, { maior: 7, pontos: 0 }), true);
  assert.equal(R.metaCumprida({ tipo: 'fruta', k: 6 }, { maior: 5, pontos: 9999 }), false);
  assert.equal(R.metaCumprida({ tipo: 'pontos', alvo: 600 }, { maior: 0, pontos: 600 }), true);
  assert.equal(R.metaCumprida({ tipo: 'pontos', alvo: 600 }, { maior: 9, pontos: 599 }), false);
});

test('salvar e retomar a partida devolve a mesma partida', () => {
  const p = { v: 1, frutas: [{ k: 0, x: 120.5, y: 300 }, { k: 4, x: 200, y: 410.25 }, { k: 9, x: 310, y: 500 }], pontos: 432, maior: 9, atual: 2, prox: 0, metaFeita: true };
  assert.deepEqual(R.restaura(R.serializa(p)), p);
});

test('partida salva estragada ou de outra versão é ignorada', () => {
  const boa = { v: 1, frutas: [{ k: 1, x: 10, y: 10 }], pontos: 0, maior: 1, atual: 0, prox: 1, metaFeita: false };
  assert.equal(R.restaura('lixo'), null);
  assert.equal(R.restaura(null), null);
  assert.equal(R.restaura(''), null);
  assert.equal(R.restaura('{"v":2}'), null);
  assert.equal(R.restaura(JSON.stringify({ ...boa, frutas: [{ k: 10, x: 1, y: 1 }] })), null);
  assert.equal(R.restaura(JSON.stringify({ ...boa, frutas: [{ k: 1, x: 'a', y: 1 }] })), null);
  assert.equal(R.restaura(JSON.stringify({ ...boa, atual: 7 })), null);
  assert.equal(R.restaura(JSON.stringify({ ...boa, frutas: 'x' })), null);
});

test('transbordou: só fruta velha, parada e acima da linha', () => {
  const base = { y: 80, r: 15, vel: 0.1, idade: 2000 };
  assert.equal(R.transbordou([base], 86), true);
  assert.equal(R.transbordou([{ ...base, idade: 500 }], 86), false);
  assert.equal(R.transbordou([{ ...base, vel: 2 }], 86), false);
  assert.equal(R.transbordou([{ ...base, y: 200 }], 86), false);
  assert.equal(R.transbordou([], 86), false);
});
