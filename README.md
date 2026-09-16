# lidibelas.github.io

Site acadêmico pessoal de **Lídia Belas**.
🔗 **https://lidibelas.github.io**

---

## Estrutura

```
├── config.js                 ← DADOS GLOBAIS (nome, foto, links, Lattes, ORCID, e-mail, idiomas)
├── data/content.js           ← CONTEÚDO (trajetória, projetos, métodos, ferramentas, publicações)
├── data/records.js           ← REGISTROS (fotos de eventos, mesas, apresentações)
├── locales/pt.json           ← Textos PT
├── locales/en.json           ← Textos EN
├── locales/es.json           ← Textos ES
├── index.html                ← Estrutura (raramente editar)
├── styles.css                ← Visual (cores no bloco :root)
├── i18n.js                   ← Sistema de idiomas (não editar)
├── images/profile/           ← FOTO PROFISSIONAL (home)
├── images/about/             ← FOTOS PESSOAIS/BIOGRÁFICAS (seção Sobre)
├── images/records/           ← FOTOS ACADÊMICAS (seção Registros)
├── images/institutions/      ← LOGO DO LABHDUFBA
└── .nojekyll                 ← Diz ao GitHub Pages para não processar com Jekyll
```

---

## As 4 categorias de imagens

| Pasta | O que vai aqui | Onde aparece no site |
|---|---|---|
| `images/profile/` | **Foto principal/profissional** — sua foto de apresentação | **Home** (abertura do site, à direita do nome) |
| `images/about/` | **Fotos pessoais e biográficas** — ensino médio, IFBA, infância, trajetória de vida | **Sobre** (ao lado do texto biográfico) |
| `images/records/` | **Fotos acadêmicas** — congressos, mesas, apresentações, eventos do LABHDUFBA | **Registros** (seção "Em espaços acadêmicos") |
| `images/institutions/` | **Logos institucionais** — logo do LABHDUFBA | **Vínculo institucional** (dentro da seção Sobre) |

**Regra fundamental:** NÃO misturar as categorias. Fotos acadêmicas vão só em `records/`. Fotos pessoais vão só em `about/`. A foto profissional vai só em `profile/`.

---

## O que editar para cada mudança

### Dados pessoais (nome, e-mail, links)
→ Edite `config.js`

**Como trocar o e-mail de contato:**
1. Abra o arquivo `config.js`
2. Na linha `email:`, troque o endereço entre aspas:
   ```js
   email: "seu.novo.email@gmail.com",
   ```
3. Faça commit e push — o site atualiza automaticamente
4. O e-mail aparece na **seção "Contato"** no final da página (com link `mailto:`)
5. Junto com o e-mail aparecem os links de **Lattes, ORCID e GitHub** (só no rodapé, não no topo)
6. Se deixar `email: ""` (vazio), **a seção Contato inteira desaparece** — sem placeholder, sem "TODO", sem campo vazio

O mesmo `config.js` centraliza: e-mail, Lattes, ORCID, GitHub e vínculo institucional.
Troque qualquer um deles no mesmo arquivo, sem editar HTML.

### Trocar a foto principal (Home)
1. Suba sua foto para `images/profile/` (pelo GitHub: "Add file" → "Upload files")
2. Abra `config.js` e ajuste o nome do arquivo em `photo:`:
   ```js
   photo: "images/profile/Profile.jpg",
   ```
3. O nome do arquivo tem que bater **exatamente** (maiúsculas/minúsculas)
4. Faça commit — a foto aparece na home automaticamente

### Trocar/adicionar foto pessoal (Sobre)
1. Suba a foto para `images/about/` (ex: `images/about/ensino-medio.jpg`)
2. Abra `config.js` e ajuste `aboutPhoto:`:
   ```js
   aboutPhoto: "images/about/ensino-medio.jpg",
   ```
3. Faça commit — a foto aparece na seção Sobre
4. Se deixar `aboutPhoto: ""` (vazio), **a foto some** sem deixar espaço vazio
5. Use fotos que contem sua trajetória pessoal: ensino médio, IFBA, infância, etc.

### Alterar o texto da seção "Sobre mim"

**Tudo está num lugar só: `locales/pt.json`.** Você nunca precisa mexer no HTML.

As chaves que controlam a seção:

```
"about.label"              → título da seção (atualmente: "Sobre mim")
"about.p1"                 → 1º parágrafo
"about.p2"                 → 2º parágrafo
"about.p3"                 → 3º parágrafo
"about.p4"                 → 4º parágrafo (fechamento)
"about.affiliationLabel"   → rótulo acima do vínculo ("Vínculo institucional")
```

**Como alterar um parágrafo:**
1. Abra `locales/pt.json`
2. Encontre a chave do parágrafo (ex: `"about.p2"`)
3. Troque o texto entre aspas
4. Faça commit — o GitHub Actions traduz EN/ES automaticamente

**Como mudar o título da seção:**
1. Abra `locales/pt.json`
2. Edite `"about.label"` (atualmente: `"Sobre mim"`)
3. Faça commit — EN e ES traduzem sozinhos ("About me" / "Sobre mí")

**Quer adicionar um 5º parágrafo?**
1. Adicione no `pt.json`: `"about.p5": "seu novo texto"`
2. Abra `index.html` e adicione após o `p4` (linha ~82):
   ```html
   <p class="prose" data-i18n="about.p5"></p>
   ```
3. Faça commit — o workflow traduz `about.p5` para EN/ES automaticamente

**Quer remover um parágrafo?**
1. Apague a linha da chave no `pt.json` (ex: `"about.p4"`)
2. Apague a linha `<p ... data-i18n="about.p4"></p>` no `index.html`
3. Faça commit

> ⚠️ Para os parágrafos (`p1`–`p4`), você precisa editar **só o `pt.json`**. Só precisa mexer no `index.html` se for **adicionar ou remover** um parágrafo (mudar a quantidade).

### Adicionar uma foto acadêmica (Registro)
1. Suba a foto para `images/records/` (ex: `mesa-seminario-2025.jpg`)
2. Abra `data/records.js`
3. Copie um bloco `{ ... }` e preencha:
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
4. Faça commit — a foto aparece automaticamente

### Alterar a legenda ou ano de um registro
→ Edite o campo `caption` ou `year` no bloco correspondente em `data/records.js`
→ Faça commit — o site atualiza automaticamente

### Remover um registro
→ Apague o bloco `{ ... }` correspondente em `data/records.js`

### Trocar a logo do LABHDUFBA
1. Renomeie a logo para `labhdufba.png`
2. Suba para `images/institutions/`
3. Faça commit — a logo aparece no bloco de vínculo institucional

### Alterar o link da logo do LABHDUFBA
→ Edite `config.js` → `affiliation.url` (vazio = não é clicável)

### Adicionar trajetória ou projeto
→ Edite `data/content.js` (estrutura do item) + `locales/pt.json` (textos)
→ EN/ES são traduzidos automaticamente pelo GitHub Actions quando você altera pt.json

### Mudar cores ou fontes
→ Edite `styles.css` → bloco `:root`

### Mudar idioma padrão
→ Edite `config.js` → `languages.default`

### Esconder um idioma
→ Edite `config.js` → remover do array `languages.active`

---

## Regras do site

- **Seção vazia = seção escondida.** Se não há publicações, a seção "Produção acadêmica" não aparece (nem no menu).
- **Campo vazio = campo escondido.** Se não há e-mail, a seção "Contato" não aparece.
- **Foto ausente = foto escondida.** Se a imagem não existe, não aparece — sem erro, sem placeholder, sem espaço vazio.
- **Logo ausente = texto aparece sem logo.** Se `labhdufba.png` não existe, o vínculo institucional mostra só o texto.
- **Nada de "TODO" na interface.** TODOs só no código/README.
- **Não inventar dados.** Só incluir informações reais e verificáveis.

---

## Como saber se minha alteração foi publicada

O site é publicado pelo **GitHub Pages** a cada commit na branch `main`.
Não há build step — é HTML/CSS/JS puro. O deploy é automático.

### Onde verificar no GitHub

1. Vá em: **github.com/lidibelas/lidibelas.github.io**
2. Clique na aba **"Actions"** (ao lado de "Code")
3. Se houver um workflow rodando, aparece um círculo amarelo girando
4. Quando terminar, aparece um check verde ✓
5. O site está atualizado

### Se não houver aba "Actions"

O GitHub Pages pode não ter workflow configurado (usa deploy nativo):
1. Vá em **Settings** → **Pages** (menu lateral esquerdo)
2. Em "Build and deployment" → "Source" deve estar **"Deploy from a branch"**
3. Em "Branch" deve estar **main** / **/(root)**
4. O tempo médio de deploy é **1–2 minutos** após o commit
5. Aparece um link verde "Your site is live" quando terminou

### Passo a passo para conferir

1. Faça o commit da sua alteração pelo GitHub (web ou celular)
2. Aguarde 1–2 minutos
3. Abra https://lidibelas.github.io
4. Se a mudança não apareceu, **force o reload**:
   - No computador: `Ctrl + Shift + R` (ou `Cmd + Shift + R` no Mac)
   - No celular: limpe a aba e abra de novo, ou abra em aba anônima
5. Se ainda não apareceu, vá na aba **Actions** e veja se o deploy terminou
6. Se o deploy falhou (X vermelho), clique nele para ver o erro

### Por que minha alteração pode não aparecer

| Causa | Como resolver |
|---|---|
| **Cache do navegador** | Force reload: `Ctrl + Shift + R` ou aba anônima |
| **Deploy ainda rodando** | Aguarde 1–2 minutos após o commit |
| **Deploy falhou** | Aba Actions → clique no X vermelho → veja o erro |
| **Sintaxe quebrada em records.js** | O arquivo precisa ser um array JS válido `var SITE_RECORDS = [...]` |
| **Nome de imagem errado** | Linux é case-sensitive: `Profile.jpg` ≠ `profile.jpg` |
| **Commit na branch errada** | O commit tem que ser na branch `main` |

### Tempo de propagação

- Commit → deploy: **1–2 minutos**
- Cache do CDN do GitHub: **até 10 minutos** (raro, mas pode acontecer)
- Se depois de 10 minutos + reload forçado não apareceu, há um problema real

---

## Idiomas

PT, EN e ES ativos. Arquitetura permite adicionar qualquer idioma:

1. Criar `locales/<codigo>.json` (copiar de `pt.json` e traduzir)
2. Adicionar o código em `config.js` → `languages.active`

Para esconder: remover do array. Para mudar padrão: trocar `languages.default`.

### 🌐 TRADUÇÃO AUTOMÁTICA (GitHub Actions)

**Você só precisa editar `locales/pt.json`.** O resto é automático.

Quando você faz commit alterando `locales/pt.json`, o GitHub Actions traduz automaticamente para `en.json` e `es.json` usando a API MyMemory (gratuita, sem API key).

- ✅ Você edita **só `pt.json`** → EN e ES são traduzidos automaticamente no deploy
- ✅ Traduções manuais em `en.json`/`es.json` são **preservadas** (não sobrescritas)
- ✅ Se você já traduziu algo à mão em `en.json`/`es.json`, o bot mantém sua versão
- ✅ Aparece na aba **Actions** do GitHub: "Translate Locales"

**Fluxo:**
1. Edite `pt.json` (sempre)
2. Faça commit → GitHub Actions traduz EN/ES automaticamente
3. Site atualiza em todos os idiomas

**Forçar re-tradução de tudo** (sobrescrever traduções manuais):
- GitHub → Actions → "Translate Locales" → Run workflow → digite: `force`

**Fallback de segurança:** se `en.json`/`es.json` não tiverem uma chave, o site mostra o texto em PT (implementado em `i18n.js`).

---

## Imagens — organização

```
images/
├── profile/         ← foto principal/profissional (home)
├── about/           ← fotos pessoais/biográficas (seção Sobre)
├── records/         ← fotos acadêmicas (eventos, congressos, apresentações)
└── institutions/    ← logo do LABHDUFBA
```

Cada pasta tem um `.gitkeep` para existir no Git mesmo sem imagens.

---

## Publicação

O site é publicado automaticamente pelo GitHub Pages a cada push na `main`.
HTML/CSS/JS puro, sem build step. Não é preciso rodar nenhum comando.

---

## Licença

Conteúdo: © Lídia Belas. Código: MIT.