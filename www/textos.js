// Textos do Pulp Pot em inglês (padrão) e português. Funções recebem o que muda (meta, número, nome).
const Textos = (() => {
  const NOMES = {
    en: ['Açaí', 'Jaboticaba', 'Acerola', 'Cashew apple', 'Guava', 'Passion fruit', 'Mango', 'Pineapple', 'Jackfruit', 'Watermelon'],
    pt: ['Açaí', 'Jabuticaba', 'Acerola', 'Caju', 'Goiaba', 'Maracujá', 'Manga', 'Abacaxi', 'Jaca', 'Melancia'],
  };
  const FEMININO = [false, true, true, false, true, false, true, false, true, true]; // para "um caju" / "uma manga"

  const CURIOSIDADES = {
    en: [
      'Açaí grows in big bunches on tall palm trees in the Amazon.',
      'Jaboticaba fruits grow stuck straight onto the tree trunk.',
      'One acerola can have more vitamin C than a whole orange.',
      'The cashew nut grows outside the fruit, hanging below the cashew apple.',
      'Guava hides lots of tiny hard seeds inside its pink or white flesh.',
      'Passion fruit grows on a climbing vine with big, beautiful flowers.',
      'A mango tree can keep giving fruit for more than 100 years.',
      'Each pineapple plant usually grows just one pineapple at a time.',
      'Jackfruit is the biggest fruit that grows on trees and can weigh over 30 kg.',
      'Watermelon is more than 90% water.',
    ],
    pt: [
      'O açaí cresce em cachos grandes em palmeiras altas da Amazônia.',
      'A jabuticaba nasce grudada direto no tronco da árvore.',
      'Uma única acerola pode ter mais vitamina C que uma laranja inteira.',
      'A castanha-de-caju fica do lado de fora, pendurada embaixo da fruta.',
      'A goiaba esconde muitas sementinhas duras na polpa rosa ou branca.',
      'O maracujá nasce numa trepadeira de flores grandes e bonitas.',
      'Uma mangueira pode continuar dando frutos por mais de 100 anos.',
      'Cada pé de abacaxi costuma dar só um abacaxi por vez.',
      'A jaca é a maior fruta que nasce em árvore e pode passar de 30 kg.',
      'A melancia tem mais de 90% de água.',
    ],
  };

  const TXT = {
    en: {
      next: 'Next', best: 'Best',
      goal: (meta, nomes) => meta.tipo === 'fruta' ? `Make ${/^[AEIOU]/i.test(nomes[meta.k]) ? 'an' : 'a'} ${nomes[meta.k]}` : `Score ${meta.alvo} points`,
      treePlanted: 'Goal reached! A tree was planted', orchardComplete: 'Orchard complete!',
      orchard: 'Orchard', album: 'Fruit album', albumHint: 'Tap a fruit you have made to learn about it.',
      settings: 'Settings', sfx: 'Sound effects', music: 'Background music', language: 'Language',
      watchTutorial: 'Watch the tutorial', privacy: 'Privacy and support', close: 'Close', gotIt: 'Got it', replay: 'Watch again',
      gameOver: 'The pot is full!', points: n => `${n} points`, biggest: nome => `Biggest fruit: ${nome}`,
      goalDone: 'Goal reached in this game', goalPending: 'Goal not reached yet', playAgain: 'Play again',
      tut: ['Drag to aim and let go to drop the fruit.', 'Two matching fruits merge into the next, bigger one.',
        'Each game has a goal. Reach it to plant a tree in your orchard.', 'If the pot fills past the line, the game is over.',
        'Grow the whole orchard and the macaws will come to visit!'],
      privP1: '<b>Pulp Pot collects no data at all.</b> No sign-up, ads, purchases or tracking, and it works offline.',
      privP2: 'Your games, orchard, album and settings stay only on this device. Deleting the app erases everything.',
      privP3: 'Questions or problems: WhatsApp', fone: '+55&nbsp;43&nbsp;99662-2117',
      pages: [['privacy.html', 'Privacy policy'], ['support.html', 'Support'], ['terms.html', 'Terms of use']],
      visitorLink: 'Meet these macaws in Ararakú', locked: 'Not discovered yet',
    },
    pt: {
      next: 'Próxima', best: 'Recorde',
      goal: (meta, nomes) => meta.tipo === 'fruta' ? `Crie ${FEMININO[meta.k] ? 'uma' : 'um'} ${nomes[meta.k]}` : `Faça ${meta.alvo} pontos`,
      treePlanted: 'Meta cumprida! Uma árvore foi plantada', orchardComplete: 'Pomar completo!',
      orchard: 'Pomar', album: 'Álbum de frutas', albumHint: 'Toque numa fruta que você já criou para conhecê-la.',
      settings: 'Ajustes', sfx: 'Efeitos sonoros', music: 'Música de fundo', language: 'Idioma',
      watchTutorial: 'Ver o tutorial', privacy: 'Privacidade e suporte', close: 'Fechar', gotIt: 'Entendi', replay: 'Ver de novo',
      gameOver: 'O pote encheu!', points: n => `${n} pontos`, biggest: nome => `Maior fruta: ${nome}`,
      goalDone: 'Meta cumprida nesta partida', goalPending: 'Meta ainda não cumprida', playAgain: 'Jogar de novo',
      tut: ['Arraste para mirar e solte para a fruta cair.', 'Duas frutas iguais se juntam e viram a próxima, maior.',
        'Cada partida tem uma meta. Cumpriu, planta uma árvore no pomar.', 'Se o pote passar da linha, a partida acaba.',
        'Complete o pomar e receba a visita das araras!'],
      privP1: '<b>O Pulp Pot não coleta nenhum dado.</b> Não tem cadastro, anúncios, compras nem rastreamento, e funciona sem internet.',
      privP2: 'Suas partidas, o pomar, o álbum e os ajustes ficam só neste aparelho. Desinstalar o app apaga tudo.',
      privP3: 'Dúvidas ou problemas: WhatsApp', fone: '(43)&nbsp;99662-2117',
      pages: [['privacidade.html', 'Política de privacidade'], ['suporte.html', 'Suporte'], ['termos.html', 'Termos de uso']],
      visitorLink: 'Conheça estas araras no Ararakú', locked: 'Ainda não descoberta',
    },
  };

  return { TXT, NOMES, CURIOSIDADES };
})();
if (typeof module !== 'undefined') module.exports = Textos;
