# Pulp Pot

Jogo de juntar frutas brasileiras num pote (estilo Suika), com meta por partida, pomar de 10 árvores visitado pelas araras do Ararakú e álbum de frutas.
Roda no navegador em `pulppot.convivetecnologia.com.br` (VPS, `/srv/jogos/public/pulppot`) e no iPhone embrulhado com Capacitor 8.
Tudo roda dentro do app, sem internet. Não há Mac: a compilação e o envio acontecem no GitHub Actions (`.github/workflows/ios.yml`).

- `www/` o jogo: `regras.js` (regras puras, testadas), `textos.js` (EN/PT e curiosidades), `desenho.js`, `som.js`, `index.html`, `matter.min.js` (Matter.js 0.20.0) e `LICENSES.txt`
- `tests/` testes (`npm test`) · `loja/` páginas de privacidade, suporte e termos (EN/PT) e capturas 6,9" (1320x2868) em `loja/en` e `loja/pt`
- `ios/` projeto Xcode (Swift Package Manager) · `ferramentas/asc-publica.js` preenche a App Store Connect pela API
- Identificador do app (não muda depois de publicado): `br.com.convivetecnologia.pulppot` · Apple ID do app: `6826701887`
- Versão 1.0; o número do build é o número da execução da esteira

Publicar o jogo na web: `npm run jogo` (scp para a VPS) e commit no git de `/srv/jogos`.
Atualizar o app: commit → `gh workflow run ios.yml -R cidadedigitalai/pulppot-app` → novo build no TestFlight.
Só conferir se compila, sem Apple: `gh workflow run ios.yml -R cidadedigitalai/pulppot-app -f testflight=false`.

## Página da loja

O idioma principal do app na App Store Connect é **inglês (EUA)**; o português (Brasil) é o segundo idioma.
Os textos abaixo são os que `ferramentas/asc-publica.js` envia.

### English (primary)

**Name:** Pulp Pot
**Subtitle:** Brazilian fruit merge puzzle
**Privacy Policy URL:** https://pulppot.convivetecnologia.com.br/privacy.html
**Support URL:** https://pulppot.convivetecnologia.com.br/support.html
**Screenshots:** `loja/en/` (5)

**Promotional text:**
Drop Brazilian fruits into the pot and merge matching ones into bigger fruit. Reach each goal to plant a tree and grow an orchard the macaws love to visit.

**Keywords:**
fruit,merge,drop,watermelon,puzzle,casual,brazil,acai,mango,orchard,relax,family,offline

**Description:**
Pulp Pot is a cozy merging puzzle with the fruits of Brazil.

Drop fruits into the pot. When two matching fruits touch, they merge into the next, bigger one: açaí, jaboticaba, acerola, cashew apple, guava, passion fruit, mango, pineapple, jackfruit and, at last, watermelon. Keep the pot from overflowing past the line and see how far you can go.

Every game has a goal, like making a mango or reaching 600 points. Reach it and a tree is planted in your orchard right away, and losing a game never takes it back. As the orchard grows, the macaws from Ararakú come to visit.

- 10 Brazilian fruits with cheerful little faces
- A new goal every game and a 10-tree orchard to grow
- Fruit album with a true fun fact about each fruit
- No timer: play at your own pace
- Your game is saved automatically if you close the app
- Animated tutorial, plus music and sound effects you can turn off
- Play in English or Portuguese
- Works offline, no ads, no purchases, no data collected

**App Review notes:**
Offline game, no login and no purchases. Drag on the pot to aim and release to drop a fruit; two matching fruits that touch merge into a bigger one. The first goal (make a Cashew apple, the 4th fruit) usually takes about a minute and plants a tree in the orchard (tree button at the top, which also shows the fruit album). The game is in English and Portuguese (EN | PT buttons at the top). An animated tutorial opens on first launch (dismiss with "Got it"; it can be replayed in Settings). Settings, privacy policy and support links are in the sliders button at the top. There is no timer, no loot box and no in-app purchase.

### Português (Brasil)

**Nome:** Pulp Pot
**Subtítulo:** Junte as frutas do Brasil
**URL da política de privacidade:** https://pulppot.convivetecnologia.com.br/privacidade.html
**URL de suporte:** https://pulppot.convivetecnologia.com.br/suporte.html
**Capturas:** `loja/pt/` (5)

**Texto promocional:**
Solte frutas brasileiras no pote e junte as iguais para criar frutas maiores. Cumpra cada meta para plantar uma árvore e receber a visita das araras.

**Palavras-chave:**
fruta,juntar,melancia,quebra-cabeça,casual,Brasil,açaí,manga,pomar,relaxar,família,offline

**Descrição:**
Pulp Pot é um quebra-cabeça gostoso de juntar as frutas do Brasil.

Solte as frutas no pote. Quando duas iguais se encostam, elas viram a próxima, maior: açaí, jabuticaba, acerola, caju, goiaba, maracujá, manga, abacaxi, jaca e, por fim, melancia. Não deixe o pote passar da linha e veja até onde você chega.

Cada partida tem uma meta, como criar uma manga ou fazer 600 pontos. Cumpriu, uma árvore é plantada no seu pomar na hora, e perder uma partida nunca tira a árvore. Conforme o pomar cresce, as araras do Ararakú vêm visitar.

- 10 frutas brasileiras com carinhas sorridentes
- Uma meta nova a cada partida e um pomar de 10 árvores para crescer
- Álbum de frutas com uma curiosidade verdadeira sobre cada uma
- Sem relógio: jogue no seu ritmo
- A partida fica salva sozinha se você fechar o app
- Tutorial animado, além de música e efeitos sonoros que podem ser desligados
- Jogue em português ou inglês
- Funciona sem internet, sem anúncios, sem compras e sem coletar nenhum dado

## Respostas para os questionários da App Store Connect

| Onde | Pergunta | Resposta |
|---|---|---|
| Informações do app | Categoria | Jogos · subcategorias Quebra-cabeça e Casual |
| Informações do app | Direitos de conteúdo: contém, mostra ou acessa conteúdo de terceiros? | **Não** (frutas, ícone e araras são do dono do app; Matter.js e fontes são licenças livres, em `www/LICENSES.txt`) |
| Privacidade do app | Você ou seus parceiros coletam dados deste app? | **Não** → aparece "Dados não coletados" (só pelo site; a API não responde isso) |
| Privacidade do app | Rastreamento / identificador de publicidade | Não usa |
| Classificação etária | Violência, sexo, linguagem, drogas, terror, jogos de azar, concursos, tema médico | **Nenhum / Não** em tudo |
| Classificação etária | Caixas de prêmio (loot box), acesso irrestrito à web, conteúdo de usuários, chat, anúncios | **Não** em tudo → classificação **4+** |
| Classificação etária | Feito para crianças (categoria Infantil) | **Não** (fica em Jogos) |
| Conformidade de exportação | Usa criptografia? | Já respondido dentro do app (`ITSAppUsesNonExemptEncryption = NÃO`) |
| Contrato de licença | EULA | Padrão da Apple; termos complementares em `terms.html` / `termos.html` |
| Informações para a revisão | É preciso login? | **Não** |
| Preço e disponibilidade | Preço / países | Grátis · 148 países, todos menos os 27 da União Europeia (para entrar na UE é preciso a declaração da Lei de Serviços Digitais em Business) |
| Contas | Exclusão de conta | Não se aplica (o app não tem contas) |

O que já está dentro do app para a revisão: política de privacidade acessível pelo botão de ajustes (regra 5.1.1),
manifesto de privacidade `ios/App/App/PrivacyInfo.xcprivacy` (sem rastreamento, sem coleta), nenhum pedido de permissão,
nenhum serviço de terceiros, idiomas declarados (`CFBundleLocalizations`: en, pt-BR) e funcionamento offline
(o jogo vem dentro do app, não é um site carregado da internet; regra 4.2).
