# Pulp Pot — desenho do jogo (24/10/2026)

## Intenção e porquê

O Matheus pediu um jogo que "faz com que a pessoa não saia dele", nas palavras dele: "preciso passar logo isso... vou ganhar mais um ponto... usando a psicologia". É o segundo jogo depois do Ararakú (já enviado para a App Store) e segue o mesmo esquema técnico e de publicação.

O conceito foi debatido entre Claude e GPT (Codex) e validado por um protótipo jogável que o Matheus jogou e aprovou ("genial... isso prende"). O protótipo está em `/srv/jogos/public/pomar/index.html` (VPS, usuário `jogos`) e é a referência viva de visual e jogabilidade.

Os dois motores psicológicos pedidos são:
- **"Vou ganhar mais um ponto"**: placar e recorde dentro de uma partida rápida, com decisão a cada queda e reinício instantâneo.
- **"Preciso passar logo isso"**: uma meta concreta por partida que, cumprida, planta uma árvore num pomar de 10 árvores com visitantes.

## O jogo em uma frase

Frutas brasileiras com carinha caem num pote; duas iguais que se encostam viram a próxima, maior; se o pote transbordar acima da linha, a partida acaba (estilo Suika/Watermelon Game, com identidade brasileira).

## Objetivos

1. Loop de 10 segundos gostoso e justo: mirar, soltar, ver a fusão, planejar a próxima com a fruta seguinte visível.
2. Partida com tensão crescente (o pote enche) e reinício em um toque, sem telas intermediárias.
3. Uma meta por partida que dá o "preciso passar essa".
4. Progresso permanente que sobrevive à derrota: árvores do pomar, visitantes e álbum de frutas.
5. Herdar do Ararakú tudo o que já provou funcionar (ver Restrições).

## Não-objetivos da versão 1 (decididos no debate e aceitos)

Loja, moedas, poderes ou ajudas pagas, anúncios, compras, ranking online, desafio diário, sequência de dias, notificações, replay gravado, mapa navegável.

## Anti-objetivos (o jogo fracassa se fizer isto, mesmo funcionando)

- Recompensa aleatória com valor (loot box), escassez falsa, temporizador de culpa, punição por ficar dias sem jogar. A classificação é 4+ e o questionário da Apple pergunta sobre loot box: a resposta tem que ser "não".
- Coletar qualquer dado do jogador.
- Física injusta: fruta tremendo parada, fusão dupla, fruta atravessando parede ou "explodindo" para fora do pote. Física injusta mata o "só mais uma".
- Tela que rola, ou layout que corta o pote em iPhone pequeno.
- Emoji ou setas Unicode na interface (regra do Matheus): só texto, SVG ou desenho em canvas.

## Restrições

- **Técnica:** uma página HTML com CSS e JS no próprio arquivo, mais os recursos ao lado. A física usa **Matter.js 0.20.0 em arquivo local**, não do CDN como no protótipo. Funciona offline. Mesmo esquema de pastas do Ararakú.
- **Onde vive:** site em `/srv/jogos/public/pulppot/` (VPS) e domínio `https://pulppot.convivetecnologia.com.br`. O Matheus cria o registro A `pulppot` apontando para 134.209.45.236 no Registro.br; depois entra um bloco no Caddy, como foi feito para o `araraku.convivetecnologia.com.br`.
- **App iPhone:** Capacitor 8 com Swift Package Manager e plugin Haptics, num repositório novo `cidadedigitalai/pulppot-app`, público como o do Ararakú. A esteira GitHub Actions é a mesma, assinando só na exportação, e os segredos são da mesma conta Apple (Team 62QV3M88MJ). Bundle ID `br.com.convivetecnologia.pulppot`.
- **Tela:** iPhone em pé, sem rolagem. O body tem 100dvh com overflow hidden, e o pote se ajusta ao espaço livre por ResizeObserver, movendo o chão da física junto. O app desliga a rolagem com `ios.scrollEnabled: false`.
- **Idiomas:** inglês por padrão, português se o aparelho estiver em português, e botões EN | PT que lembram a escolha. Os textos ficam num dicionário dentro do HTML, como no Ararakú.
- **Privacidade:** nada sai do aparelho. Só `localStorage`: recorde, árvores, meta atual, álbum, partida salva, idioma, som, música e tutorial visto. Leva manifesto `PrivacyInfo.xcprivacy` sem coleta e `ITSAppUsesNonExemptEncryption = false`.
- **Páginas:** privacidade, suporte e termos em EN e PT, no domínio do jogo, com o mesmo conteúdo do Ararakú adaptado (contato WhatsApp +55 43 99662-2117).

## Decidido pelo Matheus

- **Conceito:** juntar frutas num pote, com estas 10 frutas nesta ordem: açaí, jabuticaba, acerola, caju, goiaba, maracujá, manga, abacaxi, jaca, melancia.
- **Visual:** frutas desenhadas no código, como no protótipo: gradiente, brilho, carinha e detalhe de cada fruta (coroa do abacaxi, castanha do caju, listras da melancia), respingo de suco na fusão.
- **Nome:** **Pulp Pot**. Estava livre na App Store em 24/10, nos EUA e no Brasil. A confirmação final acontece ao criar o app na App Store Connect.
- **Domínio:** subdomínio da Convive, não domínio próprio.
- **Ganchos e exclusões:** os ganchos priorizados no debate e as exclusões da v1 listadas acima.

## Regras do jogo

- **Escada e tamanhos:** os raios e as cores do protótipo são o ponto de partida, e o construtor pode ajustar. Só as 5 primeiras frutas aparecem para soltar, com o açaí mais frequente.
- **Fusão:**
  - Duas frutas iguais que se encostam somem e nasce a seguinte no ponto médio, com um "pop" de escala, respingo e som.
  - Uma fusão rende `PONTOS[k] × 2`, com `PONTOS = 1,3,6,10,15,21,28,36,45,55`.
  - Duas melancias somem e dão +100.
  - Cada par funde uma única vez.
- **Soltar:** o jogador arrasta para mirar, com uma guia vertical, e solta para a fruta cair. Há uma espera de cerca de 0,4 s entre quedas.
- **Fim de partida:** acontece se uma fruta assentada, que já caiu há algum tempo e está parada, ficar acima da linha por mais de 1,5 s. A linha pisca em vermelho enquanto houver risco.
- **Pote:** mais baixo que o do protótipo, para o aperto chegar mais cedo. O alvo é uma primeira partida de 2 a 4 minutos, a ser medida; a proporção exata fica a cargo do construtor.

## Metas, pomar e visitantes

- **Uma meta por partida**, visível no topo com o desenho da fruta. Exemplo: "Crie um caju".
- **Progressão:** escolha minha, que o construtor pode ajustar os valores, mas não a forma.
  - As 3 primeiras metas são fixas e ensinam: caju, goiaba e maracujá.
  - Depois, a dificuldade sobe a cada 3 árvores: manga para as árvores 4 a 6, abacaxi para as 7 a 9 e jaca para a 10.
  - Metas de pontuação equivalentes podem se alternar com as de fruta a partir da 4ª árvore, sem repetir a mesma meta duas vezes seguidas.
- **Ao cumprir a meta:**
  - A árvore é plantada na hora, com aviso, vibração de sucesso e som.
  - A partida continua para quem quiser bater o recorde.
  - A próxima meta só começa na próxima partida.
  - Perder depois disso não desfaz nada.
- **Depois das 10 árvores:** aparece "Pomar completo". As metas seguem num rodízio entre as mais difíceis, para manter o "passar essa", e o pomar continua cheio.
- **Visitantes:** escolha minha. São as araras do Ararakú, reaproveitando as 4 ilustrações e asas que já existem:
  - Arara-azul na árvore 2.
  - Canindé na árvore 4.
  - Vermelha na árvore 6.
  - Lear na árvore 8.
  - As quatro juntas na árvore 10.
  - Elas aparecem pousadas na tela do pomar. Tocar numa arara pode abrir a página do Ararakú na App Store; isso é opcional.
- **Álbum:** as 10 frutas, em silhueta até serem criadas pela primeira vez. Tocar numa fruta mostra o nome e uma curiosidade verdadeira em EN e PT.

## Telas

1. **Jogo:**
   - **Topo:** nome, próxima fruta, placar e recorde, botões de pomar e ajustes.
   - **Faixa da meta:** fruta e texto, mais as 10 árvores pequenas.
   - **Pote:** ocupa o resto da tela.
2. **Fim de partida (modal):** pontos, recorde, maior fruta, situação da meta e "Jogar de novo".
3. **Pomar (modal ou tela):** trilha das 10 árvores com os visitantes, e o álbum.
4. **Ajustes (modal):** efeitos sonoros, música, idioma, rever tutorial, privacidade e suporte.
5. **Tutorial animado:** abre na primeira vez, com um dedo mostrando mirar e soltar, uma fusão e a meta. Só "Entendi" fecha, e dá para rever pelos Ajustes. Mesmo padrão do Ararakú.

## Salvar e retomar

A partida em andamento é salva com posição e tipo de cada fruta, placar, fruta atual e próxima, e meta. O salvamento acontece ao esconder a aba ou o app e periodicamente. Ao abrir, a partida é retomada com as frutas recriadas nas posições salvas e velocidade zero.

## Som e vibração

- **Som:** tudo sintetizado no navegador, sem arquivos, como no Ararakú. Há um som de queda, um de fusão com tom que depende do tamanho da fruta, um de meta cumprida e um de fim de partida.
- **Música de fundo:** própria, em laço, que abaixa nos eventos.
- **Vibração (Capacitor Haptics):** leve nas fusões, média nas fusões grandes, sucesso na meta e erro no fim.

## Loja e Apple

- **Mesmo processo do Ararakú:** registrar o bundle ID pela API, o Matheus cria o app na App Store Connect, e o preenchimento é feito pela API. O fluxo cobre textos EN e PT, capturas 6,9", categoria, idade 4+, preço grátis, países e build. O Matheus responde a "Privacidade do app" na web.
- **Categoria:** Jogos, com subcategorias Quebra-cabeça e Casual.
- **Países:** todos menos a UE, como no Ararakú, até o Matheus declarar o status de comerciante pela lei europeia DSA.

## Fica para o construtor

Constantes de física, proporção do pote, cores finas, desenho de cada fruta, sons e melodia, valores exatos da tabela de metas, textos das curiosidades (que precisam ser verdadeiros) e o layout das telas dentro das restrições.

## Como saber que deu certo

- O Matheus joga e sente "só mais uma".
- Quem joga pela primeira vez entende sem ler nada além do tutorial.
- Não há falha de física em 20 minutos seguidos de teste.
- Nenhuma tela rola em iPhone pequeno (375x667) nem em grande (440x956).
- O jogo é aprovado na revisão da Apple.

## Decisão posterior (24/10)

Sem modo com tempo: o Matheus decidiu que o Pulp Pot não terá relógio, nem no modo principal nem como modo extra.
