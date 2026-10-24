// Preenche a App Store Connect do Pulp Pot para publicação (NÃO envia para revisão).
// uso: node ferramentas/asc-publica.js <AuthKey.p8> <keyId> <issuerId> <pasta-pulppot-app> <build>
// Cada etapa roda isolada: se uma falhar, as outras seguem e o resumo mostra o que ficou para a web.
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const [arqChave, keyId, issuer, raiz, BUILD] = process.argv.slice(2);
const APP = "6826701887", SITE = "https://pulppot.convivetecnologia.com.br/";
const UE = "AUT BEL BGR HRV CYP CZE DNK EST FIN FRA DEU GRC HUN IRL ITA LVA LTU LUX MLT NLD POL PRT ROU SVK SVN ESP SWE".split(" ");
if (!BUILD) { console.error("falta o número do build"); process.exit(1); }

const b64 = o => Buffer.from(JSON.stringify(o)).toString("base64url");
let token, tokenEm = 0;
const jwt = () => { const agora = Math.floor(Date.now() / 1000); if (agora - tokenEm < 900) return token;
  const corpo = b64({ alg: "ES256", kid: keyId, typ: "JWT" }) + "." + b64({ iss: issuer, iat: agora, exp: agora + 1200, aud: "appstoreconnect-v1" });
  tokenEm = agora; return token = corpo + "." + crypto.sign("sha256", Buffer.from(corpo), { key: fs.readFileSync(arqChave, "utf8"), dsaEncoding: "ieee-p1363" }).toString("base64url"); };
const api = async (caminho, metodo = "GET", body) => {
  const r = await fetch("https://api.appstoreconnect.apple.com" + caminho, { method: metodo, headers: { Authorization: "Bearer " + jwt(), "Content-Type": "application/json" }, body: body && JSON.stringify(body) });
  if (r.status === 204) return {};
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${r.status} ${metodo} ${caminho.split("?")[0]}: ${(j.errors || []).map(e => (e.title || "") + " - " + (e.detail || "")).join("; ")}`);
  return j;
};
const resumo = [];
const etapa = async (nome, fn) => { try { const r = await fn(); resumo.push(`OK    ${nome}${r ? " (" + r + ")" : ""}`); } catch (e) { resumo.push(`ERRO  ${nome}: ${e.message}`); } };

const TXT = {
  "en-US": {
    name: "Pulp Pot", subtitle: "Brazilian fruit merge puzzle", privacy: SITE + "privacy.html", support: SITE + "support.html", shots: "loja/en",
    promo: "Drop Brazilian fruits into the pot and merge matching ones into bigger fruit. Reach each goal to plant a tree and grow an orchard the macaws love to visit.",
    keywords: "fruit,merge,drop,watermelon,puzzle,casual,brazil,acai,mango,orchard,relax,family,offline",
    description: `Pulp Pot is a cozy merging puzzle with the fruits of Brazil.

Drop fruits into the pot. When two matching fruits touch, they merge into the next, bigger one: açaí, jaboticaba, acerola, cashew apple, guava, passion fruit, mango, pineapple, jackfruit and, at last, watermelon. Keep the pot from overflowing past the line and see how far you can go.

Every game has a goal, like making a mango or reaching 600 points. Reach it and a tree is planted in your orchard right away, and losing a game never takes it back. As the orchard grows, the macaws from Ararakú come to visit.

- 10 Brazilian fruits with cheerful little faces
- A new goal every game and a 10-tree orchard to grow
- Fruit album with a true fun fact about each fruit
- No timer: play at your own pace
- Your game is saved automatically if you close the app
- Animated tutorial, plus music and sound effects you can turn off
- Play in English or Portuguese
- Works offline, no ads, no purchases, no data collected`,
  },
  "pt-BR": {
    name: "Pulp Pot", subtitle: "Junte as frutas do Brasil", privacy: SITE + "privacidade.html", support: SITE + "suporte.html", shots: "loja/pt",
    promo: "Solte frutas brasileiras no pote e junte as iguais para criar frutas maiores. Cumpra cada meta para plantar uma árvore e receber a visita das araras.",
    keywords: "fruta,juntar,melancia,quebra-cabeça,casual,Brasil,açaí,manga,pomar,relaxar,família,offline",
    description: `Pulp Pot é um quebra-cabeça gostoso de juntar as frutas do Brasil.

Solte as frutas no pote. Quando duas iguais se encostam, elas viram a próxima, maior: açaí, jabuticaba, acerola, caju, goiaba, maracujá, manga, abacaxi, jaca e, por fim, melancia. Não deixe o pote passar da linha e veja até onde você chega.

Cada partida tem uma meta, como criar uma manga ou fazer 600 pontos. Cumpriu, uma árvore é plantada no seu pomar na hora, e perder uma partida nunca tira a árvore. Conforme o pomar cresce, as araras do Ararakú vêm visitar.

- 10 frutas brasileiras com carinhas sorridentes
- Uma meta nova a cada partida e um pomar de 10 árvores para crescer
- Álbum de frutas com uma curiosidade verdadeira sobre cada uma
- Sem relógio: jogue no seu ritmo
- A partida fica salva sozinha se você fechar o app
- Tutorial animado, além de música e efeitos sonoros que podem ser desligados
- Jogue em português ou inglês
- Funciona sem internet, sem anúncios, sem compras e sem coletar nenhum dado`,
  },
};
const NOTAS = "Offline game, no login and no purchases. Drag on the pot to aim and release to drop a fruit; two matching fruits that touch merge into a bigger one. The first goal (make a Cashew apple, the 4th fruit) usually takes about a minute and plants a tree in the orchard (tree button at the top, which also shows the fruit album). The game is in English and Portuguese (EN | PT buttons at the top). An animated tutorial opens on first launch (dismiss with \"Got it\"; it can be replayed in Settings). Settings, privacy policy and support links are in the sliders button at the top. There is no timer, no loot box and no in-app purchase.";

(async () => {
  const titular = (await api("/v1/users")).data.find(u => u.attributes.roles.includes("ACCOUNT_HOLDER")).attributes;
  const appInfo = (await api(`/v1/apps/${APP}/appInfos`)).data[0];
  const versao = (await api(`/v1/apps/${APP}/appStoreVersions?filter[platform]=IOS&limit=5`)).data.find(v => ["PREPARE_FOR_SUBMISSION", "DEVELOPER_REJECTED", "REJECTED", "METADATA_REJECTED"].includes(v.attributes.appStoreState || v.attributes.appVersionState));
  if (!versao) throw new Error("versão editável não encontrada");

  await etapa("categoria Jogos > Quebra-cabeça + Casual", () => api(`/v1/appInfos/${appInfo.id}`, "PATCH", { data: { type: "appInfos", id: appInfo.id, relationships: {
    primaryCategory: { data: { type: "appCategories", id: "GAMES" } },
    primarySubcategoryOne: { data: { type: "appCategories", id: "GAMES_PUZZLE" } },
    primarySubcategoryTwo: { data: { type: "appCategories", id: "GAMES_CASUAL" } } } } }));

  await etapa("direitos de conteúdo: não usa conteúdo de terceiros", () => api(`/v1/apps/${APP}`, "PATCH", { data: { type: "apps", id: APP, attributes: { contentRightsDeclaration: "DOES_NOT_USE_THIRD_PARTY_CONTENT" } } }));

  await etapa("classificação etária (tudo nenhum/não)", async () => {
    const d = (await api(`/v1/appInfos/${appInfo.id}/ageRatingDeclaration`)).data;
    const BOOL = ["gambling", "unrestrictedWebAccess", "lootBox", "messagingAndChat", "parentalControls", "userGeneratedContent", "advertising", "healthOrWellnessTopics", "ageAssurance", "seventeenPlus"];
    const ENUM = /alcohol|contests|gamblingSimulated|horror|mature|medical|profanity|sexual|violence|guns/i;
    const at = {};
    for (const k of Object.keys(d.attributes)) { if (BOOL.includes(k)) at[k] = false; else if (ENUM.test(k)) at[k] = "NONE"; }
    await api(`/v1/ageRatingDeclarations/${d.id}`, "PATCH", { data: { type: "ageRatingDeclarations", id: d.id, attributes: at } });
    return Object.keys(at).length + " respostas";
  });

  const infoLocs = (await api(`/v1/appInfos/${appInfo.id}/appInfoLocalizations`)).data;
  for (const loc of Object.keys(TXT)) {
    const t = TXT[loc], ex = infoLocs.find(l => l.attributes.locale === loc);
    const attributes = { name: t.name, subtitle: t.subtitle, privacyPolicyUrl: t.privacy };
    await etapa(`nome/subtítulo/privacidade ${loc}`, () => ex
      ? api(`/v1/appInfoLocalizations/${ex.id}`, "PATCH", { data: { type: "appInfoLocalizations", id: ex.id, attributes } })
      : api("/v1/appInfoLocalizations", "POST", { data: { type: "appInfoLocalizations", attributes: { locale: loc, ...attributes }, relationships: { appInfo: { data: { type: "appInfos", id: appInfo.id } } } } }));
  }

  await etapa("copyright + lançamento automático", () => api(`/v1/appStoreVersions/${versao.id}`, "PATCH", { data: { type: "appStoreVersions", id: versao.id,
    attributes: { copyright: `2026 ${titular.firstName} ${titular.lastName}`, releaseType: "AFTER_APPROVAL" } } }));

  await etapa(`build ${BUILD} na versão 1.0`, async () => {
    const b = (await api(`/v1/builds?filter[app]=${APP}&filter[version]=${BUILD}`)).data[0];
    if (!b) throw new Error("build não encontrado (a Apple ainda pode estar processando)");
    if (b.attributes.processingState !== "VALID") throw new Error("build ainda em " + b.attributes.processingState);
    await api(`/v1/appStoreVersions/${versao.id}/relationships/build`, "PATCH", { data: { type: "builds", id: b.id } });
  });

  await etapa("dados para a revisão (contato, sem login, notas)", async () => {
    const attributes = { contactFirstName: titular.firstName, contactLastName: titular.lastName, contactPhone: "+55 43 99662-2117", contactEmail: titular.username, demoAccountRequired: false, notes: NOTAS };
    const ex = (await api(`/v1/appStoreVersions/${versao.id}/appStoreReviewDetail`).catch(() => ({}))).data;
    if (ex) await api(`/v1/appStoreReviewDetails/${ex.id}`, "PATCH", { data: { type: "appStoreReviewDetails", id: ex.id, attributes } });
    else await api("/v1/appStoreReviewDetails", "POST", { data: { type: "appStoreReviewDetails", attributes, relationships: { appStoreVersion: { data: { type: "appStoreVersions", id: versao.id } } } } });
  });

  let verLocs = (await api(`/v1/appStoreVersions/${versao.id}/appStoreVersionLocalizations`)).data;
  for (const loc of Object.keys(TXT)) {
    const t = TXT[loc]; let ex = verLocs.find(l => l.attributes.locale === loc);
    const attributes = { description: t.description, keywords: t.keywords, promotionalText: t.promo, supportUrl: t.support };
    await etapa(`textos da loja ${loc}`, async () => {
      if (ex) await api(`/v1/appStoreVersionLocalizations/${ex.id}`, "PATCH", { data: { type: "appStoreVersionLocalizations", id: ex.id, attributes } });
      else ex = (await api("/v1/appStoreVersionLocalizations", "POST", { data: { type: "appStoreVersionLocalizations", attributes: { locale: loc, ...attributes }, relationships: { appStoreVersion: { data: { type: "appStoreVersions", id: versao.id } } } } })).data;
    });
    if (!ex) continue;
    await etapa(`capturas ${loc}`, async () => {
      const sets = (await api(`/v1/appStoreVersionLocalizations/${ex.id}/appScreenshotSets`)).data;
      let set = sets.find(s => s.attributes.screenshotDisplayType === "APP_IPHONE_67");
      if (set) { const velhas = (await api(`/v1/appScreenshotSets/${set.id}/appScreenshots`)).data; if (velhas.length) return `já tinha ${velhas.length}, não mexi`; }
      else set = (await api("/v1/appScreenshotSets", "POST", { data: { type: "appScreenshotSets", attributes: { screenshotDisplayType: "APP_IPHONE_67" }, relationships: { appStoreVersionLocalization: { data: { type: "appStoreVersionLocalizations", id: ex.id } } } } })).data;
      const pasta = path.join(raiz, t.shots), arqs = fs.readdirSync(pasta).filter(f => f.endsWith(".png")).sort();
      for (const f of arqs) {
        const buf = fs.readFileSync(path.join(pasta, f));
        const sh = (await api("/v1/appScreenshots", "POST", { data: { type: "appScreenshots", attributes: { fileName: f, fileSize: buf.length }, relationships: { appScreenshotSet: { data: { type: "appScreenshotSets", id: set.id } } } } })).data;
        for (const op of sh.attributes.uploadOperations) {
          const h = Object.fromEntries((op.requestHeaders || []).map(x => [x.name, x.value]));
          const r = await fetch(op.url, { method: op.method, headers: h, body: buf.subarray(op.offset, op.offset + op.length) });
          if (!r.ok) throw new Error(`upload ${f}: ${r.status}`);
        }
        await api(`/v1/appScreenshots/${sh.id}`, "PATCH", { data: { type: "appScreenshots", id: sh.id, attributes: { uploaded: true, sourceFileChecksum: crypto.createHash("md5").update(buf).digest("hex") } } });
      }
      return arqs.length + " enviadas";
    });
  }

  await etapa("preço: grátis", async () => {
    let pontos = [], url = `/v1/apps/${APP}/appPricePoints?filter[territory]=USA&limit=200`;
    while (url) { const r = await api(url); pontos = pontos.concat(r.data); url = r.links?.next ? r.links.next.replace("https://api.appstoreconnect.apple.com", "") : null; if (pontos.find(p => +p.attributes.customerPrice === 0)) break; }
    const gratis = pontos.find(p => +p.attributes.customerPrice === 0);
    if (!gratis) throw new Error("ponto de preço grátis não encontrado");
    await api("/v1/appPriceSchedules", "POST", { data: { type: "appPriceSchedules", relationships: {
        app: { data: { type: "apps", id: APP } }, baseTerritory: { data: { type: "territories", id: "USA" } },
        manualPrices: { data: [{ type: "appPrices", id: "${preco1}" }] } } },
      included: [{ type: "appPrices", id: "${preco1}", attributes: { startDate: null }, relationships: { appPricePoint: { data: { type: "appPricePoints", id: gratis.id } } } }] });
  });

  await etapa("países: todos menos a União Europeia", async () => {
    let terr = [], url = "/v1/territories?limit=200";
    while (url) { const r = await api(url); terr = terr.concat(r.data.map(t => t.id)); url = r.links?.next ? r.links.next.replace("https://api.appstoreconnect.apple.com", "") : null; }
    const inc = terr.map(t => ({ type: "territoryAvailabilities", id: "${" + t + "}", attributes: { available: !UE.includes(t) }, relationships: { territory: { data: { type: "territories", id: t } } } }));
    await api("/v2/appAvailabilities", "POST", { data: { type: "appAvailabilities", attributes: { availableInNewTerritories: false },
      relationships: { app: { data: { type: "apps", id: APP } }, territoryAvailabilities: { data: inc.map(i => ({ type: i.type, id: i.id })) } } }, included: inc });
    return `${terr.length - UE.filter(u => terr.includes(u)).length} de ${terr.length} países`;
  });

  console.log(resumo.join("\n"));
})().catch(e => { console.log(resumo.join("\n")); console.error("ERRO GERAL:", e.message); process.exit(1); });
