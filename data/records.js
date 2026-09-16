/* ============================================
   data/records.js — Registros da trajetória
   ============================================
   
   ESTE ARQUIVO contém fotografias de eventos,
   mesas, apresentações e outros momentos da
   trajetória acadêmica.
   
   Como ADICIONAR um registro:
   1. Suba a foto para images/records/
      (ex: images/records/mesa-seminario-2026.jpg)
   2. Copie um bloco { ... } abaixo
   3. Preencha os campos
   4. Faça commit
   5. A imagem aparece automaticamente
   
   Como REMOVER um registro:
   1. Apague o bloco { ... } correspondente
   2. Faça commit
   
   Regras:
   - Se a lista estiver vazia [], a seção
     inteira de Registros ESCODE (nada aparece).
   - Não invente registros. Só inclua fotos reais.
   - O campo "alt" é obrigatório (acessibilidade).
   - O campo "link" é opcional.
   ============================================ */

var SITE_RECORDS = [
  // {
  //  
    image: "images/records/Apresentacao_congresso_ufba_2025.jpg",
    title: "Apresentação no Congresso UFBA",
    year: "2025",
    context: "Universidade Federal da Bahia",
    caption: "Apresentação oral do trabalho “Mas você é Índio mesmo?”",
    alt: "Lídia Belas e Ludmilla Gonçalves durante apresentação no congresso UFBA",
  // },
];
