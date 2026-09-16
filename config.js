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
  // Foto principal/profissional — aparece na HOME (abertura do site)
  photo: "images/profile/Profile.jpg",  // coloque sua foto em images/profile/ (nome exato do arquivo)

  // Foto pessoal/biográfica — aparece na seção "Sobre"
  // Use fotos da sua trajetória pessoal: ensino médio, IFBA, infância, etc.
  // Se vazio "", a foto do "Sobre" é escondida (sem placeholder, sem espaço vazio)
  aboutPhoto: "images/about/turma_metalurgia.jpg", // ex: "images/about/ensino-medio.jpg"

  // --- Links (vazio = não mostra) ---
  email: "lidiavieirabelas@gmail.com",
  lattes: "http://lattes.cnpq.br/5758630474226047",
  lattesId: "5758630474226047",
  orcid: "https://orcid.org/0009-0008-7211-4492",
  github: "https://github.com/lidibelas",

  // --- Vínculos institucionais (pode ter 1 ou vários) ---
  // Cada vínculo: { role, lab, labShort, period, logo, url }
  // - logo: coloque a imagem em images/institutions/ (ex: "images/institutions/logo_1.png")
  // - Se logo vazio ("") ou a imagem não existir, aparece só o texto, sem imagem quebrada
  // - url vazio ("") = logo não é clicável
  // - Para adicionar um vínculo: copie um bloco { ... } e coloque depois do último
  // - Para remover: apague o bloco { ... } correspondente
  affiliations: [
    {
      role: "Graduanda em Ciências Sociais — Antropologia",
      lab: "Faculdade de Filosofia e Ciências Humanas · UFBA",
      labShort: "FFCH/UFBA",
      period: "2023 — atual",
      logo: "images/institutions/logo_1.png",
      url: "https://www.ufba.br/"
    },
    {
      role: "Bolsista pesquisadora",
      lab: "Laboratório de Humanidades Digitais da UFBA",
      labShort: "LABHDUFBA",
      period: "2025 — atual",
      logo: "images/institutions/logo_2.png",
      url: "https://labhdufba.github.io/pt/"
    }
  ],

  // --- Formação ---
  education: {
    degree: "Graduanda em Ciências Sociais — Antropologia",
    institution: "Faculdade de Filosofia e Ciências Humanas · UFBA",
    detail: "Bacharelado em Ciências Sociais — Antropologia",
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
