/* ============================================
   data/profile.js — Dados de perfil da Lídia
   ============================================
   
   EDITE ESTE ARQUIVO para atualizar:
   - Trajetória acadêmica (timeline)
   - Informações pessoais básicas
   
   Este arquivo é carregado pelo index.html.
   Não precisa de servidor — é JavaScript puro.
   ============================================ */

var PROFILE_DATA = {
  // Timeline / Trajetória
  // Para adicionar um item, copie um bloco abaixo e mude o "id".
  // O texto exibido vem do arquivo de idioma (locales/xx.json),
  // usando a chave "timeline.<id>.date/title/desc".
  // Se a chave não existir no idioma, usa o valor padrão aqui.
  timeline: [
    {
      id: 'pibic2026',
      date: '2026 —',
      title: 'TODO: inserir título do PIBIC 2026',
      desc: 'Novo projeto PIBIC no LABHDUFBA. Título a ser definido.'
    },
    {
      id: 'pibic2025',
      date: '2025 — 2026',
      title: 'Desinformação em saúde, sociologia digital e polarização política no Brasil',
      desc: 'Bolsa PIBIC no LABHDUFBA/UFBA.'
    },
    {
      id: 'labhd',
      date: '2025 —',
      title: 'LABHDUFBA',
      desc: 'Ingresso no Laboratório de Humanidades Digitais da UFBA como bolsista pesquisadora.'
    },
    {
      id: 'ufba',
      date: '—',
      title: 'Ciências Sociais · UFBA',
      desc: 'Graduação em Ciências Sociais com bacharelado em Antropologia.'
    }
  ]
};