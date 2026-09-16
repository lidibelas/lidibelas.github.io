/* ============================================
   i18n.js — Sistema de internacionalização
   ============================================
   
   Como funciona:
   1. Ao carregar, verifica ?lang=XX na URL
   2. Se não houver, verifica localStorage
   3. Se não houver, usa "pt" (padrão)
   4. Carrega o JSON do idioma escolhido
   5. Substitui todos os elementos com [data-i18n]
   6. Atualiza <html lang="...">
   
   Para adicionar um novo idioma (ex: chinês/zh):
   1. Crie locales/zh.json com as mesmas chaves
   2. Adicione um botão no header: 
      <button class="lang-btn" data-lang="zh">中文</button>
   3. Pronto — o sistema detecta automaticamente.
   ============================================ */

(function () {
  'use strict';

  const SUPPORTED = ['pt', 'en', 'es'];
  const DEFAULT_LANG = 'pt';
  let currentLang = DEFAULT_LANG;
  let translations = {};

  function detectLang() {
    // 1. URL query param (?lang=en)
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && SUPPORTED.includes(urlLang)) return urlLang;

    // 2. localStorage
    const stored = localStorage.getItem('lang');
    if (stored && SUPPORTED.includes(stored)) return stored;

    // 3. Browser language
    const browser = navigator.language.slice(0, 2);
    if (SUPPORTED.includes(browser)) return browser;

    // 4. Default
    return DEFAULT_LANG;
  }

  async function loadTranslations(lang) {
    try {
      const resp = await fetch(`locales/${lang}.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (e) {
      console.warn(`Não foi possível carregar locales/${lang}.json:`, e);
      // Fallback to Portuguese
      if (lang !== DEFAULT_LANG) {
        try {
          const resp = await fetch(`locales/${DEFAULT_LANG}.json`);
          return await resp.json();
        } catch (e2) {
          console.error('Erro crítico: não foi possível carregar nenhum arquivo de idioma.', e2);
          return {};
        }
      }
      return {};
    }
  }

  function applyTranslations(data) {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (data[key] !== undefined) {
        el.textContent = data[key];
      }
    });

    // HTML lang attribute
    document.documentElement.lang = getLangCode(currentLang);

    // Title and meta description
    if (data['meta.title']) document.title = data['meta.title'];
    if (data['meta.description']) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', data['meta.description']);
    }

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === currentLang);
    });

    // Re-render dynamic content (timeline, projects, publications, methods)
    renderDynamicContent(data);
  }

  function getLangCode(lang) {
    const codes = { pt: 'pt-BR', en: 'en', es: 'es' };
    return codes[lang] || lang;
  }

  async function switchLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Update URL without reload
    const url = new URL(window.location.href);
    if (lang === DEFAULT_LANG) {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url);

    translations = await loadTranslations(lang);
    applyTranslations(translations);
  }

  // --- Dynamic content rendering ---

  function renderDynamicContent(t) {
    renderTimeline(t);
    renderProjects(t);
    renderPublications(t);
    renderMethodsTools(t);
  }

  function renderTimeline(t) {
    const container = document.getElementById('timeline-container');
    if (!container || typeof PROFILE_DATA === 'undefined') return;

    const items = PROFILE_DATA.timeline || [];
    container.innerHTML = items.map(function (item) {
      const dateKey = 'timeline.' + item.id + '.date';
      const titleKey = 'timeline.' + item.id + '.title';
      const descKey = 'timeline.' + item.id + '.desc';
      return '<div class="timeline-item reveal">' +
        '<div class="timeline-date">' + (t[dateKey] || item.date) + '</div>' +
        '<div class="timeline-body">' +
        '<h3>' + (t[titleKey] || item.title) + '</h3>' +
        '<p>' + (t[descKey] || item.desc) + '</p>' +
        '</div></div>';
    }).join('');

    observeReveals();
  }

  function renderProjects(t) {
    const container = document.getElementById('projects-container');
    if (!container || typeof PROJECTS_DATA === 'undefined') return;

    const projects = PROJECTS_DATA.projects || [];
    container.innerHTML = projects.map(function (p) {
      const titleKey = 'projects.' + p.id + '.title';
      const descKey = 'projects.' + p.id + '.desc';
      const tags = (p.tags || []).map(function (tag) {
        return '<span class="project-tag">' + tag + '</span>';
      }).join('');
      return '<div class="project-card reveal">' +
        '<div class="project-period">' + (p.period || '') + '</div>' +
        '<div>' +
        '<h3>' + (t[titleKey] || p.title) + '</h3>' +
        '<p>' + (t[descKey] || p.desc) + '</p>' +
        (tags ? '<div>' + tags + '</div>' : '') +
        '</div></div>';
    }).join('');

    observeReveals();
  }

  function renderPublications(t) {
    const container = document.getElementById('publications-container');
    const note = document.getElementById('publications-note');
    if (!container || typeof PUBLICATIONS_DATA === 'undefined') return;

    const pubs = PUBLICATIONS_DATA.publications || [];
    if (pubs.length === 0) {
      container.innerHTML = '<div class="pub-empty">' +
        (t['publications.empty'] || 'Produções acadêmicas serão listadas aqui conforme forem publicadas.') +
        '</div>';
      if (note) note.style.display = 'block';
      return;
    }

    container.innerHTML = pubs.map(function (p) {
      const link = p.url ? ' <a href="' + p.url + '" target="_blank" rel="noopener" class="text-link pub-link">' +
        (t['publications.view'] || 'Ver publicação') + ' ↗</a>' : '';
      return '<div class="pub-entry reveal">' +
        '<div class="pub-meta">' + (p.year || '') + (p.venue ? ' · ' + p.venue : '') + '</div>' +
        '<h3>' + (p.title || '') + '</h3>' +
        (p.authors ? '<p class="pub-authors">' + p.authors + '</p>' : '') +
        link +
        '</div>';
    }).join('');

    if (note) note.style.display = 'block';
    observeReveals();
  }

  function renderMethodsTools(t) {
    const container = document.getElementById('methods-tools');
    if (!container) return;

    // Static tools list — same across languages (tool names don't translate)
    const tools = ['Zotero', 'ATLAS.ti', 'Google Docs', 'Git/GitHub', 'LaTeX/Overleaf'];
    container.innerHTML = tools.map(function (tool) {
      return '<li>' + tool + '</li>';
    }).join('');
  }

  // --- Scroll reveal animation ---

  function observeReveals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Init ---

  function addRevealClasses() {
    // Add reveal class to sections for scroll animation
    var sections = document.querySelectorAll('.section-header, .research-area, .timeline-item, .project-card, .pub-entry, .method-group, .hero > .shell > *');
    sections.forEach(function (el) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
  }

  async function init() {
    currentLang = detectLang();
    translations = await loadTranslations(currentLang);
    addRevealClasses();
    applyTranslations(translations);

    // Language button listeners
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchLang(btn.getAttribute('data-lang'));
      });
    });

    // Observe initial reveals
    observeReveals();

    // Set year in footer
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();