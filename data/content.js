/* ============================================
   data/content.js — Conteúdo editável do site
   ============================================
   
   ESTE ARQUIVO contém:
   - Trajetória acadêmica (timeline)
   - Projetos PIBIC (separados da agenda pessoal)
   - Métodos/abordagens (confirmados)
   - Ferramentas (confirmadas)
   - Produção acadêmica (real e verificável)
   
   Regras:
   - NÃO invente informações. Só inclua dados reais.
   - Se uma lista estiver vazia [], o site ESCONDE a seção.
   - TODOs internos só no código, nunca na interface.
   - Para textos multilíngues, edite locales/*.json
   ============================================ */

var SITE_CONTENT = {

  // --- Trajetória acadêmica ---
  // Para adicionar um item, copie um bloco { ... }
  // O "id" deve ser único. Os textos vêm de locales/xx.json
  // Se o texto não existir no idioma, usa "title"/"desc" aqui.
  trajectory: [
    {
      id: "pibic2025",
      period: "2025 — 2026",
      title: "PIBIC — Desinformação em saúde, sociologia digital e polarização política no Brasil",
      institution: "LABHDUFBA · UFBA",
      desc: "Projeto de iniciação científica desenvolvido no contexto do LABHDUFBA."
    },
    {
      id: "pibic2026",
      period: "2026 — atual",
      title: "PIBIC — Recuperação semântica e organização de corpus multimodal para arquitetura aplicada às Ciências Sociais",
      institution: "LABHDUFBA · UFBA",
      desc: "Projeto de iniciação científica desenvolvido no contexto do LABHDUFBA."
      // NOTA: NÃO inventar título/tema/metodologia.
      // Quando a Lídia fornecer, preencher aqui e em locales/*.json.
    }
  ],

  // --- Projetos PIBIC ---
  // Separados da agenda pessoal de pesquisa.
  // Se vazio [], a seção de Projetos é escondida inteira.
  projects: [
    {
      id: "desinformacao-saude",
      period: "2025 — 2026",
      title: "Ecossistemas multiplataformas e ataques a integridade da informação em saúde: os movimentos antivacina no Brasil",
      desc: "Projeto de iniciação científica sobre desinformação em saúde, sociologia digital e polarização política, desenvolvido no LABHDUFBA, em parceria com o Instituto de Saúde Coletiva.",
      tags: ["PIBIC", "Desinformação", "Sociologia digital", "LABHDUFBA"]
    }
    // O novo PIBIC 2026 NÃO aparece aqui até que o título real seja fornecido.
    // Não inventar.
  ],

  // --- Métodos / abordagens ---
  // SÓ incluir métodos CONFIRMADOS pela Lídia.
  // Não apresentar como metodologia já utilizada coisas não confirmadas.
  // Se vazio [], a seção de Métodos é escondida.
  methods: [
    "Métodos digitais",
    "Revisão bibliográfica",
    "Pesquisa em ambientes e plataformas digitais",
    "Exploração e organização de corpus/dados digitais",
    "Abordagem antropológica"
    // NÃO incluir (não confirmados):
    // - Análise de discurso
    // - Métodos computacionais
    // - Etnografia digital
  ],

  // --- Ferramentas ---
  // SÓ ferramentas que a Lídia realmente utiliza.
  // Se vazio [], a subseção de ferramentas é escondida.
  tools: [
    "Elasticsearch",
    "Zotero",
    "ATLAS.ti",
    "Google Docs",
    "Git/GitHub"
    // Removido: LaTeX, Overleaf (a pedido)
  ],

  // --- Produção acadêmica ---
  // SÓ publicações reais e verificáveis.
  // Se vazio [], a seção inteira de Produção é ESCONDIDA
  // (não mostra "em breve", não mostra "0 artigos", não mostra nada).
  publications: [
    // Exemplo (descomente e edite quando tiver publicações reais):
    // {
    //   year: "2026",
    //   venue: "Nome do periódico ou congresso",
    //   title: "Título do trabalho",
    //   authors: "BELAS, L.",
    //   url: "https://doi.org/..."
    // },
  ]
};
