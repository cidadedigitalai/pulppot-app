// Som do Pulp Pot, tudo sintetizado (sem arquivo de áudio). O chamador guarda efeitos/musica no localStorage.
const Som = (() => {
  let ac, ruido, mGain, passo = 0, proxT = 0, relogio = 0;
  function audio() { // o navegador só libera áudio depois de um toque
    try {
      if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); ruido = ac.createBuffer(1, ac.sampleRate * .1, ac.sampleRate); const d = ruido.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      if (ac.state === 'suspended' && !document.hidden) ac.resume();
      return ac;
    } catch (e) { return null; }
  }
  function bip(f, dur, vol, tipo = 'sine', atraso = 0) { // tom que escorrega para baixo
    const t = ac.currentTime + atraso, o = ac.createOscillator(), g = ac.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * .6, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + .02);
  }
  const pronto = () => Som.efeitos && audio();
  const abaixar = seg => { if (mGain) { mGain.gain.setTargetAtTime(.1, ac.currentTime, .05); mGain.gain.setTargetAtTime(VOL_M, ac.currentTime + seg, .2); } };

  const queda = () => { if (pronto()) bip(420, .07, .08, 'triangle'); };
  const fusao = k => { if (!pronto()) return; bip(900 / (1 + k * .22), .18, .18); bip(1300 / (1 + k * .22), .12, .1, 'triangle', .06); }; // fruta maior, som mais grave
  const meta = () => { if (!pronto()) return; abaixar(1); [72, 76, 79, 84].forEach((m, i) => bip(440 * 2 ** ((m - 69) / 12), .3, .14, 'triangle', i * .11)); };
  const fim = () => { if (!pronto()) return; abaixar(1.2); bip(392, .35, .12, 'triangle'); bip(294, .6, .12, 'triangle', .3); };

  /* Musiquinha de fundo: xotezinho em Fá, 8 compassos (F Dm Gm C7 F Dm Bb C) em laço */
  const VOL_M = .6, COLCHEIA = .28;
  const ACORDES = [[41, [65, 69, 72]], [38, [65, 69, 74]], [43, [67, 70, 74]], [36, [64, 67, 70]], [41, [65, 69, 72]], [38, [65, 69, 74]], [46, [65, 70, 74]], [36, [64, 67, 72]]];
  const MELODIA = [[72, 0, 77, 0, 76, 72, 69, 0], [74, 0, 77, 0, 81, 0, 77, 74], [79, 0, 77, 74, 0, 70, 0, 74], [76, 0, 72, 0, 70, 0, 72, 0],
    [77, 0, 81, 0, 84, 81, 77, 0], [81, 0, 77, 74, 0, 77, 0, 81], [82, 0, 81, 0, 77, 74, 0, 70], [72, 0, 76, 79, 0, 76, 72, 0]];
  function nota(m, t, dur, vol, tipo = 'sine') {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = tipo; o.frequency.value = 440 * 2 ** ((m - 69) / 12);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(mGain); o.start(t); o.stop(t + dur + .02);
  }
  function chocalho(t, vol) {
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = ruido; f.type = 'highpass'; f.frequency.value = 6000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .05);
    s.connect(f).connect(g).connect(mGain); s.start(t); s.stop(t + .06);
  }
  function tocarPasso(n, t) {
    const c = n % 8, [baixo, acorde] = ACORDES[(n >> 3) % 8], m = MELODIA[(n >> 3) % 8][c], eco = (n >> 6) % 2; // volta sim, volta não: melodia uma oitava acima
    if (c === 0 || c === 4) nota(c ? baixo + 7 : baixo, t, .5, .25, 'triangle'); // baixo: tônica e quinta
    if (c === 2 || c === 6) for (const a of acorde) nota(a, t, .2, .05); // acorde no contratempo
    if (m) { nota(m + (eco ? 12 : 0), t, .5, eco ? .09 : .16); nota(m + (eco ? 36 : 24), t, .1, eco ? .03 : .04); }
    chocalho(t, c % 2 ? .04 : .02);
  }
  function iniciarMusica() {
    if (!Som.musica || relogio || !audio()) return;
    if (!mGain) { mGain = ac.createGain(); mGain.gain.value = VOL_M; mGain.connect(ac.destination); }
    proxT = Math.max(proxT, ac.currentTime + .1);
    relogio = setInterval(() => { while (proxT < ac.currentTime + .3) { tocarPasso(passo++, proxT); proxT += COLCHEIA; } }, 60); // agenda 0,3 s à frente
  }
  function pararMusica() { clearInterval(relogio); relogio = 0; }
  const pausar = oculto => { if (ac) oculto ? ac.suspend() : ac.resume(); }; // aba escondida ou app em segundo plano: silêncio

  const Som = { efeitos: true, musica: true, queda, fusao, meta, fim, iniciarMusica, pararMusica, pausar };
  return Som;
})();
