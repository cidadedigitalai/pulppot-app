// O app redistribui Matter.js (MIT) e as fontes Baloo 2 e Nunito (OFL): as licenças vão junto, dentro de www/.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('licenças de terceiros acompanham o jogo', () => {
  const t = fs.readFileSync(path.join(__dirname, '../www/LICENSES.txt'), 'utf8');
  assert.match(t, /Matter\.js/);
  assert.match(t, /Permission is hereby granted, free of charge/);
  assert.match(t, /Baloo/);
  assert.match(t, /Nunito/);
  assert.match(t, /SIL OPEN FONT LICENSE Version 1\.1/i);
});
