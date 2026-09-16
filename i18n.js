/* ============================================
   i18n.js — Sistema de internacionalização
   ============================================
   
   Lê idiomas ativos de SITE_CONFIG.languages.active
   Carrega locales/<lang>.json
   Substitui elementos [data-i18n]
   Renderiza conteúdo dinâmico (timeline, projetos, etc.)
   ESCONDE seções sem conteúdo (regra: nada de "vazio")
   ============================================ */

(function () {
  'use strict';

  var config = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : { languages: { active: ['pt'], default: 'pt' } };
  var content = (typeof SITE_CONTENT !== 'undefined') ? SITE_CONTENT : { trajectory: [], projects: [], methods: [], tools: [], publications: [] };

  var SUPPORTED = config.languages.active || ['pt'];
  var DEFAULT_LANG = config.languages.default || 'pt';
  var currentLang = DEFAULT_LANG;
  var translations = {};

  function detectLang() {
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get('lang');
    if (urlLang && SUPPORTED.indexOf(urlLang) >= 0) return urlLang;
    var stored = localStorage.getItem('lang');
    if (stored && SUPPORTED.indexOf(stored) >= 0) return stored;
    var browser = navigator.language.slice(0, 2);
    if (SUPPORTED.indexOf(browser) >= 0) return browser;
    return DEFAULT_LANG;
  }

  function loadTranslations(lang) {
    return fetch('locales/' + lang + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .catch(function (e) {
        console.warn('Não carregou locales/' + lang + '.json:', e);
        if (lang !== DEFAULT_LANG) {
          return fetch('locales/' + DEFAULT_LANG + '.json').then(function (r) { return r.json(); });
        }
        return {};
      });
  }

  function applyTranslations(t) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.documentElement.lang = langCode(currentLang);
    if (t['meta.title']) document.title = t['meta.title'];
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
    renderAll(t);
  }

  function langCode(lang) {
    var codes = { pt: 'pt-BR', en: 'en', es: 'es', zh: 'zh-CN' };
    return codes[lang] || lang;
  }

  function switchLang(lang) {
    if (SUPPORTED.indexOf(lang) < 0) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    var url = new URL(window.location.href);
    if (lang === DEFAULT_LANG) url.searchParams.delete('lang');
    else url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
    loadTranslations(lang).then(function (t) {
      translations = t;
      applyTranslations(t);
    });
  }

  // --- Rendering ---

  function renderAll(t) {
    renderNav(t);
    renderLangSwitcher();
    renderHeroLinks(t);
    renderAbout(t);
    renderResearchKeywords(t);
    renderTimeline(t);
    renderProjects(t);
    renderPublications(t);
    renderMethods(t);
    renderContact(t);
    renderFooter(t);
    observeReveals();
  }

  function renderNav(t) {
    var nav = document.getElementById('nav-menu');
    if (!nav) return;
    var sections = [
      { id: 'about', key: 'nav.about' },
      { id: 'research', key: 'nav.research' },
      { id: 'trajectory', key: 'nav.trajectory' },
      { id: 'projects', key: 'nav.projects' },
      { id: 'publications', key: 'nav.publications' },
      { id: 'methods', key: 'nav.methods' },
      { id: 'contact', key: 'nav.contact' }
    ];
    var html = '';
    sections.forEach(function (s) {
      var el = document.getElementById(s.id);
      // Só mostrar no menu se a seção existe e NÃO está hidden
      if (el && !el.hasAttribute('hidden')) {
        html += '<a href="#' + s.id + '">' + (t[s.key] || s.id) + '</a>';
      }
    });
    nav.innerHTML = html;
  }

  function renderLangSwitcher() {
    var sw = document.getElementById('lang-switcher');
    if (!sw) return;
    var labels = { pt: 'PT', en: 'EN', es: 'ES', zh: '中文' };
    var html = '';
    SUPPORTED.forEach(function (lang, i) {
      if (i > 0) html += '<span class="lang-sep" aria-hidden="true">·</span>';
      html += '<button class="lang-btn" data-lang="' + lang + '" aria-label="' + lang + '">' + (labels[lang] || lang) + '</button>';
    });
    sw.innerHTML = html;
    sw.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { switchLang(btn.getAttribute('data-lang')); });
    });
  }

  function renderHeroLinks(t) {
    var container = document.getElementById('hero-links');
    if (!container || !config) return;
    var html = '';
    if (config.lattes) html += '<a href="' + config.lattes + '" target="_blank" rel="noopener" class="hero-link">' + (t['hero.lattes'] || 'Lattes') + ' ↗</a>';
    if (config.orcid) html += '<a href="' + config.orcid + '" target="_blank" rel="noopener" class="hero-link">ORCID ↗</a>';
    if (config.github) html += '<a href="' + config.github + '" target="_blank" rel="noopener" class="hero-link">GitHub ↗</a>';
    if (config.email) html += '<a href="mailto:' + config.email + '" class="hero-link">' + (t['hero.email'] || 'E-mail') + ' ↗</a>';
    container.innerHTML = html;
  }

  function renderAbout(t) {
    // Photo
    var photoEl = document.getElementById('about-photo');
    if (photoEl && config.photo) {
      // Verificar se a foto existe tentando carregar
      var img = new Image();
      img.onload = function () {
        photoEl.innerHTML = '<img src="' + config.photo + '" alt="Lídia Belas" class="about-photo-img">';
        photoEl.style.display = 'block';
      };
      img.onerror = function () {
        photoEl.style.display = 'none';
      };
      img.src = config.photo;
    } else if (photoEl) {
      photoEl.style.display = 'none';
    }

    // Affiliation
    var affEl = document.getElementById('about-affiliation');
    if (affEl && config.affiliation) {
      var aff = config.affiliation;
      var html = '<div class="aff-line">' + (t['about.affiliationLabel'] || 'Vínculo institucional') + '</div>';
      html += '<div class="aff-role">' + aff.role + ' · ' + aff.lab + ' (' + (aff.labShort || '') + ')</div>';
      html += '<div class="aff-line">' + aff.period + '</div>';
      affEl.innerHTML = html;
    }
  }

  function renderResearchKeywords(t) {
    var container = document.getElementById('research-keywords');
    if (!container || !config.researchAgenda) return;
    var keywords = config.researchAgenda.keywords || [];
    var html = keywords.map(function (kw) {
      return '<span class="keyword">' + kw + '</span>';
    }).join('');
    container.innerHTML = html;
  }

  function renderTimeline(t) {
    var container = document.getElementById('timeline-container');
    if (!container) return;
    var items = content.trajectory || [];
    if (items.length === 0) {
      hideSection('trajectory');
      return;
    }
    container.innerHTML = items.map(function (item) {
      var titleKey = 'trajectory.' + item.id + '.title';
      var descKey = 'trajectory.' + item.id + '.desc';
      return '<div class="timeline-item reveal">' +
        '<div class="timeline-date">' + (item.period || '') + '</div>' +
        '<div class="timeline-body">' +
        '<h3>' + (t[titleKey] || item.title) + '</h3>' +
        (item.institution ? '<p class="timeline-inst">' + item.institution + '</p>' : '') +
        '<p>' + (t[descKey] || item.desc) + '</p>' +
        '</div></div>';
    }).join('');
  }

  function renderProjects(t) {
    var container = document.getElementById('projects-container');
    var section = document.getElementById('projects');
    if (!container || !section) return;
    var projects = content.projects || [];
    if (projects.length === 0) {
      hideSection('projects');
      return;
    }
    section.removeAttribute('hidden');
    var html = projects.map(function (p) {
      var titleKey = 'projects.' + p.id + '.title';
      var descKey = 'projects.' + p.id + '.desc';
      var tags = (p.tags || []).map(function (tag) {
        return '<span class="project-tag">' + tag + '</span>';
      }).join('');
      return '<div class="project-card reveal">' +
        '<div class="project-period">' + (p.period || '') + '</div>' +
        '<div>' +
        '<h3>' + (t[titleKey] || p.title) + '</h3>' +
        '<p>' + (t[descKey] || p.desc) + '</p>' +
        (tags ? '<div class="project-tags">' + tags + '</div>' : '') +
        '</div></div>';
    }).join('');
    container.innerHTML = html;
  }

  function renderPublications(t) {
    var container = document.getElementById('publications-container');
    var section = document.getElementById('publications');
    if (!container || !section) return;
    var pubs = content.publications || [];
    if (pubs.length === 0) {
      hideSection('publications');
      return;
    }
    section.removeAttribute('hidden');
    var html = pubs.map(function (p) {
      var link = p.url ? ' <a href="' + p.url + '" target="_blank" rel="noopener" class="text-link">' +
        (t['publications.view'] || 'Ver') + ' ↗</a>' : '';
      return '<div class="pub-entry reveal">' +
        '<div class="pub-meta">' + (p.year || '') + (p.venue ? ' · ' + p.venue : '') + '</div>' +
        '<h3>' + (p.title || '') + '</h3>' +
        (p.authors ? '<p class="pub-authors">' + p.authors + '</p>' : '') +
        link +
        '</div>';
    }).join('');
    container.innerHTML = html;
  }

  function renderMethods(t) {
    var container = document.getElementById('methods-container');
    var section = document.getElementById('methods');
    if (!container || !section) return;
    var methods = content.methods || [];
    var tools = content.tools || [];
    if (methods.length === 0 && tools.length === 0) {
      hideSection('methods');
      return;
    }
    section.removeAttribute('hidden');
    var html = '';
    if (methods.length > 0) {
      html += '<div class="method-group"><h3>' + (t['methods.approaches'] || 'Métodos e abordagens') + '</h3>';
      html += '<ul class="method-list">' + methods.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul></div>';
    }
    if (tools.length > 0) {
      html += '<div class="method-group"><h3>' + (t['methods.tools'] || 'Ferramentas') + '</h3>';
      html += '<ul class="method-list">' + tools.map(function (tool) { return '<li>' + tool + '</li>'; }).join('') + '</ul></div>';
    }
    container.innerHTML = html;
  }

  function renderContact(t) {
    var container = document.getElementById('contact-container');
    var section = document.getElementById('contact');
    if (!container || !section) return;
    // SÓ mostrar se tiver email
    if (!config.email) {
      hideSection('contact');
      return;
    }
    section.removeAttribute('hidden');
    var html = '<p class="prose prose-lead">' + (t['contact.intro'] || 'Para colaborações, orientação acadêmica ou conversas sobre pesquisa:') + '</p>';
    html += '<a href="mailto:' + config.email + '" class="contact-email">' + config.email + '</a>';
    html += '<div class="contact-social">';
    if (config.lattes) html += '<a href="' + config.lattes + '" target="_blank" rel="noopener" class="text-link">Lattes ↗</a>';
    if (config.orcid) html += '<a href="' + config.orcid + '" target="_blank" rel="noopener" class="text-link">ORCID ↗</a>';
    if (config.github) html += '<a href="' + config.github + '" target="_blank" rel="noopener" class="text-link">GitHub ↗</a>';
    html += '</div>';
    container.innerHTML = html;
  }

  function renderFooter(t) {
    var el = document.getElementById('footer-text');
    if (!el || !config) return;
    var year = new Date().getFullYear();
    el.textContent = '© ' + year + ' ' + config.name + ' · ' + (config.affiliation ? config.affiliation.labShort : '');
  }

  // --- Hide section (section + nav item) ---
  function hideSection(id) {
    var section = document.getElementById(id);
    if (section) section.setAttribute('hidden', '');
  }

  // --- Scroll reveal ---
  function observeReveals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) { obs.observe(el); });
  }

  // --- Init ---
  function addRevealClass() {
    document.querySelectorAll('.section-header, .timeline-item, .project-card, .pub-entry, .method-group, .hero-inner > *').forEach(function (el) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
  }

  function init() {
    currentLang = detectLang();
    loadTranslations(currentLang).then(function (t) {
      translations = t;
      addRevealClass();
      applyTranslations(t);
      var yearEl = document.getElementById('year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();