/* ============================================
   data/projects.js — Projetos de pesquisa
   ============================================
   
   Para ADICIONAR um projeto:
   1. Copie um bloco { ... } abaixo
   2. Mude o "id" (único, sem espaços)
   3. Preencha "period" (ex: "2025 — 2026")
   4. O título e descrição vêm do arquivo de
      idioma (locales/xx.json), chave:
      "projects.<id>.title" e "projects.<id>.desc"
   5. Se a chave não existir, usa "title" e
      "desc" deste arquivo como fallback
   6. Adicione "tags" (opcional, lista de strings)
   ============================================ */

var PROJECTS_DATA = {
  projects: [
    {
      id: 'misoginia-jogos',
      period: '2026 —',
      title: 'TODO: inserir título do PIBIC 2026',
      desc: 'Novo projeto PIBIC focado em misoginia online em jogos e comunidades de jogadores, com abordagem antropológica.',
      tags: ['PIBIC', 'Misoginia online', 'Jogos digitais', 'Antropologia Digital']
    },
    {
      id: 'desinformacao-saude',
      period: '2025 — 2026',
      title: 'Desinformação em saúde, sociologia digital e polarização política no Brasil',
      desc: 'Pesquisa PIBIC sobre desinformação em saúde, sociologia digital e polarização política, desenvolvida no LABHDUFBA/UFBA.',
      tags: ['PIBIC', 'Desinformação', 'Sociologia digital', 'LABHDUFBA']
    }
  ]
};