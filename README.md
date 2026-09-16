# lidibelas.github.io

Site acadêmico pessoal de **Lídia Belas**, publicado em **GitHub Pages**.

🔗 **URL:** https://lidibelas.github.io

---

## 📁 Estrutura dos arquivos

```
lidibelas.github.io/
├── index.html              ← Página principal (NÃO mexer no HTML estrutural)
├── styles.css              ← Estilos visuais (cores, fontes, layout)
├── i18n.js                 ← Sistema de idiomas (NÃO mexer)
├── favicon.svg             ← Ícone do site
├── 404.html                ← Página de erro
├── robots.txt              ← Configuração para buscadores
├── sitemap.xml             ← Mapa do site para buscadores
├── locales/                ← Textos em cada idioma
│   ├── pt.json             ← Português (padrão)
│   ├── en.json             ← Inglês
│   └── es.json             ← Espanhol
├── data/                   ← Seus dados (É AQUI QUE VOCÊ EDITA)
│   ├── profile.js          ← Trajetória acadêmica (timeline)
│   ├── projects.js         ← Projetos de pesquisa
│   └── publications.js     ← Publicações (artigos, capítulos, etc.)
├── assets/                 ← Imagens (foto de perfil, etc.)
│   └── .gitkeep            ← Placeholder (substitua por profile.jpg)
└── .github/workflows/
    └── update-lattes.yml   ← Automação Lattes (placeholder, inativo)
```

---

## ✏️ O que mexer e o que não mexer

### ✅ Mexa à vontade (seus dados):
- `data/profile.js` — trajetória acadêmica
- `data/projects.js` — projetos
- `data/publications.js` — publicações
- `locales/pt.json` — textos em português
- `locales/en.json` — textos em inglês
- `locales/es.json` — textos em espanhol
- `assets/profile.jpg` — sua foto
- `favicon.svg` — ícone do site (opcional)

### ⚠️ Mexa com cuidado:
- `styles.css` — só o bloco `:root` no topo (cores, fontes)
- `index.html` — só se precisar adicionar/remover seções

### ❌ Não mexa:
- `i18n.js` — sistema de idiomas (já configurado)
- `robots.txt`, `sitemap.xml` — configurados corretamente
- `404.html` — raramente precisa mudar
- `.github/workflows/update-lattes.yml` — placeholder inativo

---

## 🎨 Como trocar as cores

Abra `styles.css`. No topo, dentro de `:root`, você verá:

```css
:root {
  --ink: #1a1a2e;       /* texto principal (escuro) */
  --paper: #faf8f3;     /* fundo (off-white quente) */
  --accent: #b8533a;    /* cor de destaque (terracota) */
  --muted: #6b6964;     /* texto secundário */
  --rule: #d8d5cc;      /* linhas divisórias */
  --card: #ffffff;      /* cards */
  --bg-alt: #f3f0e8;    /* fundo alternativo de seção */
}
```

Troque apenas o valor hexadecimal (o `#xxxxxx`). Por exemplo, para usar verde como destaque:
```css
--accent: #2d6a4f;  /* verde escuro */
```

---

## 🔤 Como trocar as fontes

No topo de `styles.css`, dentro de `:root`:

```css
--font-serif: 'Crimson Pro', Georgia, 'Times New Roman', serif;
--font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
```

As fontes são carregadas do Google Fonts (link no `<head>` do `index.html`). Para trocar:
1. Vá em https://fonts.google.com e escolha uma fonte
2. Troque o nome no `--font-serif` ou `--font-mono`
3. Atualize o `<link>` do Google Fonts no `index.html`

---

## 📸 Como trocar a foto de perfil

1. Pegue sua foto e renomeie para `profile.jpg`
2. Vá no GitHub: `lidibelas/lidibelas.github.io` → pasta `assets/`
3. Clique em "Upload files" e arraste `profile.jpg`
4. Commit

**No HTML:** descomente a linha com `<img class="portrait" ...>` na seção Sobre e remova o `portrait-placeholder`. (Peça ajuda se precisar.)

---

## 📝 Como adicionar uma publicação

Abra `data/publications.js`. Você verá uma lista vazia com um exemplo comentado.

Para adicionar:
```javascript
publications: [
  {
    year: '2026',
    venue: 'Nome do periódico ou congresso',
    title: 'Título do trabalho',
    authors: 'BELAS, L.',
    url: 'https://doi.org/...'  // opcional
  },
]
```

**Importante:** só adicione publicações reais e verificáveis. Não invente.

---

## 📋 Como adicionar um projeto

Abra `data/projects.js`. Copie um bloco e mude os dados:

```javascript
{
  id: 'novo-projeto',        // único, sem espaços
  period: '2026 —',
  title: 'Título do projeto',
  desc: 'Descrição curta.',
  tags: ['PIBIC', 'Tema']
}
```

Depois adicione as traduções em cada arquivo de idioma:
- `locales/pt.json`: `"projects.novo-projeto.title"` e `"projects.novo-projeto.desc"`
- `locales/en.json`: mesmo
- `locales/es.json`: mesmo

---

## 🌍 Como adicionar um idioma (ex: chinês)

1. Crie `locales/zh.json` copiando `locales/pt.json` e traduzindo
2. Adicione o botão no `index.html`, na div `.lang-switcher`:
```html
<button class="lang-btn" data-lang="zh">中文</button>
```
3. Adicione `"zh"` na lista `SUPPORTED` dentro de `i18n.js`
4. Pronto!

---

## 📊 Onde ficam os dados do Lattes

O site tem um link direto para seu Lattes:
http://lattes.cnpq.br/5758630474226047

As publicações **não** são importadas automaticamente ainda. O workflow `.github/workflows/update-lattes.yml` é um placeholder — quando implementado, vai buscar do Lattes e atualizar `data/publications.js` automaticamente.

Por enquanto, as publicações são adicionadas manualmente em `data/publications.js`.

---

## ⚙️ Como o site é publicado

1. Todo push para a branch `main` publica o site
2. GitHub Pages serve os arquivos diretamente (sem build)
3. Demora ~1-2 minutos para atualizar
4. URL: https://lidibelas.github.io

---

## 🔄 Como forçar atualização do site

Basta fazer qualquer commit e push para `main`. O GitHub Pages republica automaticamente.

```bash
git add -A
git commit -m "atualiza conteúdo"
git push origin main
```

---

## 🤖 Como saber que a automação rodou

O workflow Lattes (`.github/workflows/update-lattes.yml`) está **inativo** (`if: false`). Quando for ativado:
1. Vá em Actions no GitHub
2. Veja "Update Lattes Publications"
3. Se tiver commit automático, aparecerá lá

---

## 🌐 Como o sistema de idiomas funciona

- **Padrão:** português (sem `?lang=` na URL)
- **Outros idiomas:** `?lang=en` ou `?lang=es` na URL
- **Memória:** o idioma escolhido fica salvo no navegador (localStorage)
- **Detecção automática:** se alguém acessa com navegador em inglês, o site tenta inglês
- **Troca:** clique em PT/EN/ES no header — troca sem recarregar a página

---

## ♿ Acessibilidade e SEO

O site já inclui:
- ✅ Responsividade (funciona em celular e desktop)
- ✅ Navegação por teclado (Tab, Enter)
- ✅ Link "Pular para conteúdo"
- ✅ Alt text em imagens
- ✅ Contraste WCAG AA
- ✅ `prefers-reduced-motion` (desativa animações)
- ✅ Meta tags (Open Graph, Twitter Card, canonical)
- ✅ Sitemap.xml e robots.txt
- ✅ Favicon
- ✅ hreflang (multilíngue SEO)
- ✅ ORCID e Lattes no HTML (meta + visível)

---

## 📞 Resumo rápido: o que editar para cada mudança

| Quero... | Edite... |
|---|---|
| Trocar cores | `styles.css` → bloco `:root` |
| Trocar fontes | `styles.css` → `:root` + `<link>` no `index.html` |
| Mudar bio/textos | `locales/pt.json` (e en/es) |
| Adicionar publicação | `data/publications.js` |
| Adicionar projeto | `data/projects.js` + `locales/*.json` |
| Mudar trajetória | `data/profile.js` + `locales/*.json` |
| Trocar foto | `assets/profile.jpg` |
| Adicionar idioma | `locales/novo.json` + botão no `index.html` + `i18n.js` |

---

## 📜 Licença

Conteúdo: © Lídia Belas. Código: MIT.