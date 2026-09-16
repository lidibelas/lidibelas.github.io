/* ============================================
   config.js — Configuração central do site
   ============================================
   
   ESTE É O ÚNICO ARQUIVO que você precisa editar
   para mudar dados globais do site.
   
   O que está aqui:
   - nome, foto, links, e-mail
   - Lattes, ORCID, GitHub
   - vínculo institucional (LABHDUFBA)
   - idiomas ativos e idioma padrão
   - configurações visuais não-cor (ver styles.css :root para cores)
   
   Regras:
   - Se um campo estiver vazio ("") ou null,
     o site NÃO mostra esse elemento.
   - TODOs internos só aparecem no código,
     nunca na interface pública.
   ============================================ */

var SITE_CONFIG = {

  // --- Identidade ---
  name: "Lídia Belas",
  photo: "images/profile/Profile.jpg",  // coloque sua foto em images/profile/ (nome exato do arquivo)

  // --- Links (vazio = não mostra) ---
  email: "lidiabelasvieira@gmail.com",
  lattes: "http://lattes.cnpq.br/5758630474226047",
  lattesId: "5758630474226047",
  orcid: "https://orcid.org/0009-0008-7211-4492",
  github: "https://github.com/lidibelas",

  // --- Vínculo institucional ---
  affiliation: {
    role: "Bolsista pesquisadora",
    lab: "Laboratório de Humanidades Digitais da UFBA",
    labShort: "LABHDUFBA",
    period: "2025 — atual",
    // Logo do laboratório: coloque a imagem em images/institutions/labhdufba.png
    // Se não existir, o texto aparece normalmente sem imagem quebrada.
    logo: "images/institutions/labhdufba.png",
    // Link oficial do laboratório (vazio = logo não é clicável)
    url: ""  // TODO: inserir URL oficial do LABHDUFBA quando disponível
  },

  // --- Formação ---
  education: {
    degree: "Graduanda em Antropologia",
    institution: "Universidade Federal da Bahia (UFBA)",
    detail: "Bacharelado em Antropologia",
    period: "2023 — atualmente"
  },

  // --- Agenda de pesquisa (não é o PIBIC, é sua agenda pessoal) ---
  researchAgenda: {
    focus: "Misoginia online em jogos digitais e comunidades de jogadores",
    approach: "Abordagem antropológica",
    keywords: [
      "Misoginia online",
      "Jogos digitais",
      "Gênero e tecnologia",
      "Antropologia Digital",
      "Culturas e comunidades digitais",
      "Sociabilidade online"
    ]
  },

  // --- Idiomas ---
  languages: {
    active: ["pt", "en", "es"],      // idiomas disponíveis no site
    default: "pt",                    // idioma padrão
    // para adicionar um idioma: crie locales/<codigo>.json e adicione o código aqui
    // para esconder um idioma temporariamente: remova o código do array
    // para mudar o padrão: troque o valor de "default"
  },

  // --- Lattes ---
  lattesSync: {
    // A sincronização automática do Lattes NÃO é confiável porque:
    // 1. O Lattes exige reCAPTCHA (não tem API pública)
    // 2. Não há endpoint oficial para extração de dados
    //
    // Solução implementada:
    // - Script Python (scripts/lattes_export.py) que você roda localmente
    // - Gera data/lattes_cache.json com os dados extraídos do seu Lattes
    // - O site lê esse cache automaticamente
    // - Se o cache não existir, o site usa os dados manuais
    // - Se uma sincronização falhar, NADA é apagado
    // - O workflow do GitHub faz commit do cache quando ele muda
    //
    // Como atualizar:
    // 1. Abra seu Lattes no navegador
    // 2. Rode: python3 scripts/lattes_export.py (abre o Lattes no browser)
    // 3. O script extrai: formação, projetos, produções
    // 4. Gera data/lattes_cache.json
    // 5. Faça commit e push
    // 6. O site atualiza automaticamente
    cacheFile: "data/lattes_cache.json"
  }
};