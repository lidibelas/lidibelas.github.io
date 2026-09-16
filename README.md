# lidibelas.github.io

Site acadêmico pessoal de **Lídia Belas**.
🔗 **https://lidibelas.github.io**

---

## Estrutura

```
├── config.js              ← DADOS GLOBAIS (nome, links, Lattes, ORCID, e-mail, idiomas)
├── data/content.js        ← CONTEÚDO (trajetória, projetos, métodos, ferramentas, publicações)
├── data/lattes_cache.json ← CACHE do Lattes (gerado por script, não editar à mão)
├── locales/pt.json        ← Textos PT
├── locales/en.json        ← Textos EN
├── locales/es.json        ← Textos ES
├── index.html             ← Estrutura (raramente editar)
├── styles.css             ← Visual (cores no bloco :root)
├── i18n.js                ← Sistema de idiomas (não editar)
├── scripts/lattes_export.py ← Script para extrair dados do Lattes
├── assets/profile.jpg     ← SUA FOTO (só colocar o arquivo aqui)
└── .github/workflows/     ← Automação
```

---

## O que editar para cada mudança

| Quero... | Edito... |
|---|---|
| Mudar nome, e-mail, links | `config.js` |
| Adicionar trajetória/projeto | `data/content.js` + `locales/*.json` |
| Trocar cores | `styles.css` → bloco `:root` |
| Trocar fontes | `styles.css` → `:root` + `<link>` no `index.html` |
| Colocar minha foto | Colocar `profile.jpg` em `assets/` |
| Adicionar publicação | `data/content.js` |
| Mudar idioma padrão | `config.js` → `languages.default` |
| Esconder um idioma | `config.js` → remover de `languages.active` |
| Adicionar idioma (ex: zh) | Criar `locales/zh.json` + adicionar em `config.js` |
| Atualizar dados do Lattes | `python3 scripts/lattes_export.py` |

---

## Foto

Coloque (ou substitua) o arquivo `assets/profile.jpg`.
O site detecta automaticamente. Se o arquivo não existir, a foto não aparece — sem erro.

---

## Regras do site

- **Seção vazia = seção escondida.** Se não há publicações, a seção "Produção acadêmica" não aparece (nem no menu).
- **Campo vazio = campo escondido.** Se não há e-mail em `config.js`, a seção "Contato" não aparece.
- **Nada de "TODO" na interface.** TODOs só existem no código/README.
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
3. Adicionar um botão (automático pelo JS)

Para esconder um idioma temporariamente: remover do array `active`.
Para mudar o padrão: trocar `languages.default`.

---

## Publicação

O site é publicado automaticamente pelo GitHub Pages a cada push na `main`.
Não há build step — é HTML/CSS/JS puro.

---

## Licença

Conteúdo: © Lídia Belas. Código: MIT.