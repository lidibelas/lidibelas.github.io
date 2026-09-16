# lidibelas.github.io

Site acadêmico pessoal de **Lídia Belas**.
🔗 **https://lidibelas.github.io**

---

## Estrutura

```
├── config.js                 ← DADOS GLOBAIS (nome, links, Lattes, ORCID, e-mail, idiomas, logo LABHDUFBA)
├── data/content.js           ← CONTEÚDO (trajetória, projetos, métodos, ferramentas, publicações)
├── data/records.js           ← REGISTROS (fotos de eventos, mesas, apresentações)
├── data/lattes_cache.json    ← CACHE do Lattes (gerado por script, não editar à mão)
├── locales/pt.json           ← Textos PT
├── locales/en.json           ← Textos EN
├── locales/es.json           ← Textos ES
├── index.html                ← Estrutura (raramente editar)
├── styles.css                ← Visual (cores no bloco :root)
├── i18n.js                   ← Sistema de idiomas (não editar)
├── scripts/lattes_export.py  ← Script para extrair dados do Lattes
├── images/profile/           ← SUA FOTO PRINCIPAL (profile.jpg)
├── images/records/           ← FOTOS DE EVENTOS E APRESENTAÇÕES
├── images/institutions/      ← LOGO DO LABHDUFBA (labhdufba.png)
└── .github/workflows/        ← Automação
```

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
4. O e-mail aparece em dois lugares:
   - **Botão "E-mail" na home** (ao lado de Lattes, ORCID, GitHub)
   - **Seção "Contato"** no final da página (com link `mailto:`)
5. Se deixar `email: ""` (vazio), **ambos desaparecem** — sem placeholder, sem "TODO", sem campo vazio

O mesmo `config.js` centraliza: e-mail, Lattes, ORCID, GitHub e vínculo institucional.
Troque qualquer um deles no mesmo arquivo, sem editar HTML.

### Trocar minha foto principal
1. Renomeie sua foto para `profile.jpg`
2. Suba para a pasta `images/profile/` (pelo GitHub: "Add file" → "Upload files")
3. Faça commit
4. A foto aparece automaticamente

### Adicionar uma foto de evento (registro)
1. Suba a foto para `images/records/` (ex: `mesa-seminario-2026.jpg`)
2. Abra `data/records.js`
3. Copie um bloco ` { ... }` e preencha:
   ```
   {
     image: "images/records/mesa-seminario-2026.jpg",
     title: "Nome da mesa ou evento",
     year: "2026",
     context: "UFBA",
     caption: "Breve descrição da minha participação.",
     alt: "Lídia Belas apresentando na mesa X",
     link: ""  // opcional: URL do evento
   },
   ```
4. Faça commit
5. A foto aparece automaticamente

### Alterar a legenda de um registro
→ Edite o campo `caption` no bloco correspondente em `data/records.js`

### Remover um registro
→ Apague o bloco ` { ... }` correspondente em `data/records.js`

### Trocar a logo do LABHDUFBA
1. Renomeie a logo para `labhdufba.png`
2. Suba para `images/institutions/`
3. Faça commit
4. A logo aparece no bloco de vínculo institucional

### Alterar o link da logo do LABHDUFBA
→ Edite `config.js` → `affiliation.url` (vazio = não é clicável)

### Adicionar trajetória ou projeto
→ Edite `data/content.js` + `locales/*.json`

### Mudar cores ou fontes
→ Edite `styles.css` → bloco `:root`

### Mudar idioma padrão
→ Edite `config.js` → `languages.default`

### Esconder um idioma
→ Edite `config.js` → remover do array `languages.active`

### Adicionar um idioma (ex: chinês)
1. Crie `locales/zh.json` (copie de `pt.json` e traduz)
2. Adicione `"zh"` em `config.js` → `languages.active`

### Atualizar dados do Lattes
→ `python3 scripts/lattes_export.py`

---

## Regras do site

- **Seção vazia = seção escondida.** Se não há publicações, a seção "Produção acadêmica" não aparece (nem no menu).
- **Campo vazio = campo escondido.** Se não há e-mail, a seção "Contato" não aparece.
- **Foto ausente = foto escondida.** Se a imagem não existe, não aparece — sem erro, sem placeholder, sem espaço vazio.
- **Logo ausente = texto aparece sem logo.** Se `labhdufba.png` não existe, o vínculo institucional mostra só o texto.
- **Nada de "TODO" na interface.** TODOs só no código/README.
- **Não inventar dados.** Só incluir informações reais e verificáveis.

---

## Lattes

O Lattes **não tem API pública** e exige reCAPTCHA. Sincronização 100% automática não é confiável.

**Solução implementada:**

1. Script Python (`scripts/lattes_export.py`) que abre o Lattes no navegador
2. Você resolve o CAPTCHA manualmente
3. O script extrai: formação, atuação, projetos, produções
4. Gera `data/lattes_cache.json`
5. Você faz commit e push
6. O site usa o cache automaticamente

**Alternativa sem Selenium:** exporte o XML do Lattes (Download > XML) e rode:
```
python3 scripts/lattes_export.py arquivo.xml
```

**Segurança:**
- Se a extração falhar, o cache anterior é preservado
- Se o cache estiver vazio, o site não publica vazio
- O workflow do GitHub valida o cache em cada push

---

## Idiomas

PT, EN e ES ativos. Arquitetura permite adicionar qualquer idioma:

1. Criar `locales/<codigo>.json` (copiar de `pt.json` e traduzir)
2. Adicionar o código em `config.js` → `languages.active`

Para esconder: remover do array. Para mudar padrão: trocar `languages.default`.

---

## Imagens — organização

```
images/
├── profile/         ← foto principal (profile.jpg)
├── records/         ← fotos de eventos e apresentações
└── institutions/    ← logo do LABHDUFBA (labhdufba.png)
```

Cada pasta tem um `.gitkeep` para existir no Git mesmo sem imagens.

---

## Publicação

O site é publicado automaticamente pelo GitHub Pages a cada push na `main`.
HTML/CSS/JS puro, sem build step.

---

## Licença

Conteúdo: © Lídia Belas. Código: MIT.