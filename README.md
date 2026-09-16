# lidibelas.github.io

Site acadêmico pessoal de **Lídia Belas**.
🔗 **https://lidibelas.github.io**

---

## Arquivos do projeto

```
├── config.js                 ← DADOS GLOBAIS (nome, foto, links, Lattes, ORCID, e-mail, idiomas)
├── data/content.js           ← CONTEÚDO (trajetória, projetos, métodos, ferramentas, publicações)
├── data/records.js           ← REGISTROS (fotos de eventos, mesas, apresentações)
├── locales/pt.json           ← Textos em PT (FONTE — você edita este)
├── locales/en.json           ← Textos em EN (traduzido automaticamente)
├── locales/es.json           ← Textos em ES (traduzido automaticamente)
├── index.html                ← Estrutura da página (editar só para adicionar/remover parágrafos ou seções)
├── styles.css                ← Visual (cores no bloco :root)
├── i18n.js                   ← Sistema de idiomas (não editar)
├── images/profile/           ← Foto principal/profissional (home)
├── images/about/             ← Fotos pessoais/biográficas (seção Sobre)
├── images/records/           ← Fotos acadêmicas (seção Registros)
├── images/institutions/      ← Logo do LABHDUFBA
└── .nojekyll                 ← Diz ao GitHub Pages para não processar com Jekyll
```

---

## O que editar para cada mudança

### Dados pessoais (nome, e-mail, Lattes, ORCID, GitHub)
→ Edite **`config.js`**

- **E-mail:** troque o valor de `email:` (vazio = seção Contato desaparece)
- **Lattes, ORCID, GitHub:** troque os valores dos campos correspondentes
- **Vínculo institucional:** troque os campos de `affiliation` (role, lab, period, url, logo)
- **Logo do LABHDUFBA:** suba a imagem em `images/institutions/labhdufba.png` (se não existir, só aparece texto)

### Trocar a foto principal (Home)
1. Suba a foto para `images/profile/`
2. Edite `config.js` → `photo:` com o caminho exato (ex: `"images/profile/Profile.jpg"`)
3. Faça commit — o nome do arquivo tem que bater **exatamente** (maiúsculas/minúsculas)

### Trocar/adicionar foto pessoal (Sobre)
1. Suba a foto para `images/about/`
2. Edite `config.js` → `aboutPhoto:` com o caminho exato
3. `aboutPhoto: ""` (vazio) = a foto some sem deixar espaço vazio

### Alterar o texto da seção "Sobre mim"
**Tudo no `locales/pt.json` — não precisa mexer no HTML.**

```
"about.label"              → título da seção ("Sobre mim")
"about.p1"                 → 1º parágrafo
"about.p2"                 → 2º parágrafo
"about.p3"                 → 3º parágrafo
"about.p4"                 → 4º parágrafo (fechamento)
"about.affiliationLabel"   → rótulo do vínculo ("Vínculo institucional")
```

- **Mudar um parágrafo:** edita a chave no `pt.json` → commita → EN/ES traduzem sozinhos
- **Mudar o título:** edita `"about.label"` → commita → "About me" / "Sobre mí" traduzidos automaticamente
- **Adicionar um 5º parágrafo:** adiciona `"about.p5": "texto"` no `pt.json` **+** adiciona `<p class="prose" data-i18n="about.p5"></p>` no `index.html` após o `p4`
- **Remover um parágrafo:** apaga a chave no `pt.json` **+** apaga a linha `<p ... data-i18n="about.p4"></p>` no `index.html`

> ⚠️ **Resumo: onde mexer?**
> - **Trocar o texto** de um parágrafo que já existe → só `pt.json`
> - **Adicionar ou remover** um parágrafo (mudar a quantidade) → `pt.json` **+** `index.html`
> - **Refazer o Sobre inteiro** (mudar estrutura, quantidade de parágrafos, ordem) → `index.html` + `pt.json`

### Adicionar uma foto acadêmica (Registro)
1. Suba a foto para `images/records/`
2. Abra `data/records.js` e copie um bloco `{ ... }`:
   ```js
   {
     image: "images/records/mesa-seminario-2025.jpg",
     title: "Nome da mesa ou evento",
     year: "2025",
     context: "UFBA",
     caption: "Breve descrição da minha participação.",
     alt: "Lídia Belas apresentando na mesa X",
     link: ""  // opcional: URL do evento
   },
   ```
3. Adicione as chaves de tradução no `pt.json`:
   ```
   "records.2.title": "Nome da mesa ou evento",
   "records.2.context": "UFBA",
   "records.2.caption": "Breve descrição da minha participação.",
   "records.2.alt": "Lídia Belas apresentando na mesa X"
   ```
   (o número `2` corresponde à posição do registro no array — `0`, `1`, `2`...)
4. Faça commit — a foto aparece e EN/ES traduzem sozinhos

> **Alterar legenda/ano:** edita `caption` ou `year` no `data/records.js` (e a chave correspondente no `pt.json` se for texto traduzível).
> **Remover registro:** apaga o bloco `{ ... }` no `data/records.js` (e as chaves `records.N.*` no `pt.json`).

### Adicionar trajetória ou projeto
→ Edite `data/content.js` (estrutura do item) + `locales/pt.json` (textos)
→ EN/ES traduzidos automaticamente pelo GitHub Actions

### Mudar cores ou fontes
→ Edite `styles.css` → bloco `:root`

### Idiomas (padrão, esconder, adicionar)
→ Tudo em `config.js`:
- **Mudar idioma padrão:** `languages.default`
- **Esconder um idioma:** remover do array `languages.active`
- **Adicionar idioma novo:** criar `locales/<codigo>.json` (copiar de `pt.json`) + adicionar o código em `languages.active`

---

## Imagens

| Pasta | O que vai | Onde aparece |
|---|---|---|
| `images/profile/` | Foto principal/profissional | Home (abertura do site) |
| `images/about/` | Fotos pessoais e biográficas (ensino médio, IFBA, infância) | Sobre mim |
| `images/records/` | Fotos acadêmicas (congressos, mesas, apresentações) | Registros ("Em espaços acadêmicos") |
| `images/institutions/` | Logos institucionais (LABHDUFBA) | Vínculo institucional (dentro do Sobre) |

**Regras:**
- NÃO misturar as categorias — cada foto na sua pasta
- Linux é **case-sensitive**: `Profile.jpg` ≠ `profile.jpg`
- Cada pasta tem um `.gitkeep` para existir no Git mesmo sem imagens

---

## Tradução automática (GitHub Actions)

**Você só edita `locales/pt.json`.** O resto é automático.

Quando você faz commit alterando o `pt.json`, o GitHub Actions traduz automaticamente para `en.json` e `es.json` usando a API MyMemory (gratuita, sem API key).

- ✅ Edita **só `pt.json`** → EN e ES são traduzidos no deploy
- ✅ Traduções manuais em `en.json`/`es.json` são **preservadas** (não sobrescritas)
- ✅ Aparece na aba **Actions** do GitHub: "Translate Locales"
- ✅ **Fallback:** se `en.json`/`es.json` não tiverem uma chave, o site mostra o texto em PT

**Forçar re-tradução de tudo** (sobrescrever traduções manuais):
→ GitHub → Actions → "Translate Locales" → Run workflow → digite: `force`

---

## Regras do site

- **Seção vazia = seção escondida.** Sem publicações? A seção não aparece (nem no menu).
- **Campo vazio = campo escondido.** Sem e-mail? A seção Contato não aparece.
- **Foto ausente = foto escondida.** Sem erro, sem placeholder, sem espaço vazio.
- **Logo ausente = texto sem logo.** O vínculo institucional mostra só o texto.
- **Nada de "TODO" na interface.** TODOs só no código/README.
- **Não inventar dados.** Só incluir informações reais e verificáveis.

---

## Minha alteração não apareceu — e agora?

O site é publicado pelo **GitHub Pages** a cada commit na branch `main`. Deploy em **1–2 minutos**.

1. Aguarde 1–2 minutos após o commit
2. Abra https://lidibelas.github.io
3. **Force o reload:**
   - Computador: `Ctrl + Shift + R` (ou `Cmd + Shift + R` no Mac)
   - Celular: limpe a aba e abra de novo, ou use aba anônima
4. Se ainda não apareceu, vá na aba **Actions** no GitHub:
   - Círculo amarelo girando = ainda rodando
   - Check verde ✓ = terminou, site atualizado
   - X vermelho = falhou — clique para ver o erro

| Causa comum | Como resolver |
|---|---|
| Cache do navegador | `Ctrl + Shift + R` ou aba anônima |
| Deploy ainda rodando | Aguarde 1–2 minutos |
| Deploy falhou | Aba Actions → clique no X vermelho |
| Sintaxe quebrada em `records.js` | O arquivo precisa ser um array JS válido `var SITE_RECORDS = [...]` |
| Nome de imagem errado | Linux é case-sensitive: `Profile.jpg` ≠ `profile.jpg` |
| Commit na branch errada | O commit tem que ser na branch `main` |

> Cache do CDN do GitHub pode levar **até 10 minutos** (raro). Se depois disso + reload forçado não apareceu, há um problema real.

---

## Licença

Conteúdo: © Lídia Belas. Código: MIT.