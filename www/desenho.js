// Desenho das frutas (tudo em canvas, com carinha) e da arvorezinha do pomar. Usa Regras.FRUTAS.
const Desenho = (() => {
  const clarear = (hex, t) => { const n = parseInt(hex.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(v + (255 - v) * t)); return `rgb(${c})`; };

  function fruta(ctx, k, x, y, r, ang = 0, esc = 1) {
    const cor = Regras.FRUTAS[k].cor; r *= esc; ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    // extras atrás (coroa do abacaxi, castanha do caju, cabinho)
    if (k === 7) { ctx.fillStyle = '#4E9A3A'; for (const a of [-.5, 0, .5]) { ctx.beginPath(); ctx.moveTo(Math.sin(a) * r * .25, -r * .8); ctx.lineTo(Math.sin(a) * r * .75, -r * 1.35); ctx.lineTo(Math.sin(a) * r * .25 + r * .18, -r * .8); ctx.fill(); } }
    if (k === 3) { ctx.fillStyle = '#8E8C6A'; ctx.beginPath(); ctx.ellipse(r * .15, -r * .95, r * .42, r * .3, .3, 0, 7); ctx.fill(); }
    if (k === 2 || k === 4 || k === 6) {
      ctx.strokeStyle = '#5D4037'; ctx.lineWidth = r * .12; ctx.beginPath(); ctx.moveTo(0, -r * .85); ctx.lineTo(r * .08, -r * 1.12); ctx.stroke();
      ctx.fillStyle = '#66BB6A'; ctx.beginPath(); ctx.ellipse(r * .3, -r * 1.05, r * .28, r * .13, -.5, 0, 7); ctx.fill();
    }
    // corpo
    const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
    if (k === 6) { g.addColorStop(0, '#FFE082'); g.addColorStop(.5, '#FF8A3D'); g.addColorStop(1, '#E53935'); }
    else { g.addColorStop(0, clarear(cor, .45)); g.addColorStop(1, cor); }
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
    ctx.save(); ctx.clip();
    if (k === 9) { ctx.strokeStyle = '#66BB6A'; ctx.lineWidth = r * .16; for (const dx of [-.6, -.2, .2, .6]) { ctx.beginPath(); ctx.moveTo(dx * r, -r); ctx.quadraticCurveTo(dx * r * 1.5, 0, dx * r, r); ctx.stroke(); } }
    if (k === 7) { ctx.strokeStyle = 'rgba(150,90,0,.35)'; ctx.lineWidth = r * .05; for (let d = -2; d <= 2; d++) { ctx.beginPath(); ctx.moveTo(d * r * .45 - r, -r); ctx.lineTo(d * r * .45 + r, r); ctx.stroke(); ctx.beginPath(); ctx.moveTo(d * r * .45 + r, -r); ctx.lineTo(d * r * .45 - r, r); ctx.stroke(); } }
    if (k === 8 || k === 5) { ctx.fillStyle = k === 8 ? 'rgba(60,90,20,.35)' : 'rgba(160,110,10,.35)'; for (let i = 0; i < 26; i++) { const a = i * 2.4, d = r * (.2 + .75 * ((i * 37) % 10) / 10); ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * (k === 8 ? .07 : .04), 0, 7); ctx.fill(); } }
    if (k === 4) { ctx.fillStyle = 'rgba(236,64,122,.25)'; ctx.beginPath(); ctx.arc(r * .3, r * .3, r * .55, 0, 7); ctx.fill(); }
    ctx.restore();
    // brilho
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-r * .38, -r * .42, r * .22, r * .13, -.6, 0, 7); ctx.fill();
    // carinha
    const ol = r * .13, ex = r * .3, ey = -r * .05;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-ex, ey, ol, 0, 7); ctx.arc(ex, ey, ol, 0, 7); ctx.fill();
    ctx.fillStyle = '#2A1E1C'; ctx.beginPath(); ctx.arc(-ex + ol * .15, ey + ol * .1, ol * .62, 0, 7); ctx.arc(ex + ol * .15, ey + ol * .1, ol * .62, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-ex + ol * .35, ey - ol * .2, ol * .22, 0, 7); ctx.arc(ex + ol * .35, ey - ol * .2, ol * .22, 0, 7); ctx.fill();
    ctx.strokeStyle = k < 2 ? '#F3D6F5' : '#5A2A1E'; ctx.lineWidth = Math.max(1.2, r * .07); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, r * .15, r * .18, .25, Math.PI - .25); ctx.stroke();
    ctx.fillStyle = 'rgba(255,120,140,.45)'; ctx.beginPath(); ctx.ellipse(-r * .5, r * .18, r * .12, r * .07, 0, 0, 7); ctx.ellipse(r * .5, r * .18, r * .12, r * .07, 0, 0, 7); ctx.fill();
    ctx.restore();
  }

  // miniatura para placar e álbum; apagada = silhueta cinza (fruta ainda não descoberta)
  function miniatura(cv, k, apagada = false) {
    const c = cv.getContext('2d'), r = cv.width * .36;
    c.save(); c.clearRect(0, 0, cv.width, cv.height);
    fruta(c, k, cv.width / 2, cv.height / 2 + r * .12, r);
    if (apagada) { c.globalCompositeOperation = 'source-in'; c.fillStyle = '#CFC6BA'; c.fillRect(0, 0, cv.width, cv.height); }
    c.restore();
  }

  const arvoreSVG = plantada => `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="7" y="10" width="2" height="5" fill="${plantada ? '#8D6E63' : '#D7CCC8'}"/><circle cx="8" cy="7" r="6" fill="${plantada ? '#5CA84A' : '#E5DED3'}"/></svg>`;

  return { fruta, miniatura, arvoreSVG };
})();
