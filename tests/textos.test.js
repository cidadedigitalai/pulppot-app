// Textos EN/PT do Pulp Pot: os dois idiomas precisam ter as mesmas chaves, sem emoji.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const T = require('../www/textos.js');
const R = require('../www/regras.js');

const CHAVES = ['next', 'best', 'goal', 'treePlanted', 'orchardComplete', 'orchard', 'album', 'albumHint', 'settings', 'sfx', 'music', 'language',
  'watchTutorial', 'privacy', 'close', 'gotIt', 'replay', 'gameOver', 'points', 'biggest', 'goalDone', 'goalPending', 'playAgain', 'tut',
  'privP1', 'privP2', 'privP3', 'fone', 'pages', 'visitorLink', 'locked'];

test('inglês e português têm as mesmas chaves, e todas as obrigatórias', () => {
  assert.deepEqual(Object.keys(T.TXT.en).sort(), Object.keys(T.TXT.pt).sort());
  for (const c of CHAVES) assert.ok(c in T.TXT.en, `falta ${c}`);
});

test('cada chave tem o mesmo tipo e a mesma aridade nos dois idiomas', () => {
  for (const c of Object.keys(T.TXT.en)) {
    assert.equal(typeof T.TXT.pt[c], typeof T.TXT.en[c], c);
    if (typeof T.TXT.en[c] === 'function') assert.equal(T.TXT.pt[c].length, T.TXT.en[c].length, c);
  }
  assert.equal(T.TXT.en.tut.length, 5); assert.equal(T.TXT.pt.tut.length, 5);
  assert.equal(T.TXT.en.pages.length, 3); assert.equal(T.TXT.pt.pages.length, 3);
});

test('nomes e curiosidades para as 10 frutas nos dois idiomas', () => {
  for (const lang of ['en', 'pt']) {
    assert.equal(T.NOMES[lang].length, R.FRUTAS.length, lang);
    assert.equal(T.CURIOSIDADES[lang].length, R.FRUTAS.length, lang);
  }
  assert.deepEqual(T.NOMES.en, ['Açaí', 'Jaboticaba', 'Acerola', 'Cashew apple', 'Guava', 'Passion fruit', 'Mango', 'Pineapple', 'Jackfruit', 'Watermelon']);
});

test('nenhum texto tem emoji ou pictograma', () => {
  const todos = [];
  const junta = v => typeof v === 'string' ? todos.push(v) : Array.isArray(v) ? v.forEach(junta) : null;
  for (const lang of ['en', 'pt']) { Object.values(T.TXT[lang]).forEach(junta); junta(T.NOMES[lang]); junta(T.CURIOSIDADES[lang]); }
  for (const s of todos) assert.equal(/\p{Extended_Pictographic}/u.test(s), false, s);
});

test('texto da meta cita a fruta ou os pontos', () => {
  assert.match(T.TXT.pt.goal({ tipo: 'fruta', k: 6 }, T.NOMES.pt), /Manga/);
  assert.match(T.TXT.pt.goal({ tipo: 'fruta', k: 3 }, T.NOMES.pt), /um Caju/);
  assert.match(T.TXT.en.goal({ tipo: 'pontos', alvo: 600 }, T.NOMES.en), /600/);
  assert.match(T.TXT.en.goal({ tipo: 'fruta', k: 7 }, T.NOMES.en), /Pineapple/);
});
