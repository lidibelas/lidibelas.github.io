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
  var records = (typeof SITE_RECORDS !== 'undefined') ? SITE_RECORDS : [];

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

  // --- Translation cascade ---
  // When loading a non-default language, we first load the default (pt)
  // then overlay the target language on top. Missing keys in en/es
  // automatically fall back to pt — so Lídia only needs to edit pt.json
  // and the site works in all languages (pt text shows until she translates).
  var defaultTranslations = {};

  function loadTranslations(lang) {
    if (lang === DEFAULT_LANG) {
      return fetch('locales/' + lang + '.json')
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.json();
        })
        .then(function (data) {
          defaultTranslations = data;
          return data;
        })
        .catch(function (e) {
          console.warn('Não carregou locales/' + lang + '.json:', e);
          return {};
        });
    }
    // Non-default: load default first, then overlay target
    var p1 = (Object.keys(defaultTranslations).length > 0)
      ? Promise.resolve(defaultTranslations)
      : fetch('locales/' + DEFAULT_LANG + '.json').then(function (r) { return r.json(); }).catch(function () { return {}; });
    return p1.then(function (base) {
      defaultTranslations = base;
      return fetch('locales/' + lang + '.json')
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.json();
        })
        .then(function (target) {
          // Merge: base (pt) + target (en/es) — target wins for keys it has
          var merged = {};
          Object.keys(base).forEach(function (k) { merged[k] = base[k]; });
          Object.keys(target).forEach(function (k) { merged[k] = target[k]; });
          return merged;
        })
        .catch(function (e) {
          console.warn('Não carregou locales/' + lang + '.json, usando ' + DEFAULT_LANG + ':', e);
          return base; // fallback to default entirely
        });
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

  // --- Fallback cascade: if a key is missing in the current language,
  //     fall back to the default language (pt), then to a literal fallback.
  //     This means Lídia only NEEDS to edit pt.json — if en.json/es.json
  //     don't have a key yet, the site still works (showing pt text).
  function t(key, fallback) {
    if (translations[key] !== undefined) return translations[key];
    if (key === undefined) return '';
    // Will be filled by loadTranslations cascade below
    return (fallback !== undefined) ? fallback : '';
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
    renderHeroPhoto();
    renderAbout(t);
    renderResearchKeywords(t);
    renderTimeline(t);
    renderRecords(t);
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
      { id: 'records', key: 'nav.records' },
      { id: 'projects', key: 'nav.projects' },
      { id: 'publications', key: 'nav.publications' },
      { id: 'methods', key: 'nav.methods' },
      { id: 'contact', key: 'nav.contact' }
    ];
    var html = '';
    sections.forEach(function (s) {
      var el = document.getElementById(s.id);
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

  function renderHeroPhoto() {
    // --- Hero photo (professional photo, right side) ---
    var heroPhotoEl = document.getElementById('hero-photo');
    if (heroPhotoEl && config.photo) {
      var heroImg = new Image();
      heroImg.onload = function () {
        heroPhotoEl.innerHTML = '<img src="' + config.photo + '" alt="Lídia Belas" class="hero-photo-img">';
        heroPhotoEl.style.display = 'block';
      };
      heroImg.onerror = function () {
        heroPhotoEl.style.display = 'none';
      };
      heroImg.src = config.photo;
    } else if (heroPhotoEl) {
      heroPhotoEl.style.display = 'none';
    }
    // Links were moved to Contact section (footer) — hero stays clean
  }

  // --- About: photo + personal text + affiliation with logo ---

  function renderAbout(t) {
    // Photo — personal/biographical photo (NOT the professional one from the hero)
    // Uses config.aboutPhoto (images/about/...). If empty or missing, hides gracefully
    // AND collapses the layout to single column (no empty space on the left).
    var photoEl = document.getElementById('about-photo');
    var layoutEl = document.querySelector('.about-layout');
    if (photoEl && config.aboutPhoto) {
      var img = new Image();
      img.onload = function () {
        photoEl.innerHTML = '<img src="' + config.aboutPhoto + '" alt="Lídia Belas" class="about-photo-img">';
        photoEl.style.display = 'block';
        if (layoutEl) layoutEl.classList.remove('no-photo');
      };
      img.onerror = function () {
        photoEl.style.display = 'none';
        if (layoutEl) layoutEl.classList.add('no-photo');
      };
      img.src = config.aboutPhoto;
    } else if (photoEl) {
      photoEl.style.display = 'none';
      if (layoutEl) layoutEl.classList.add('no-photo');
    }

    // Affiliation block — supports multiple institutional links
    var affEl = document.getElementById('about-affiliation');
    if (affEl) {
      // Normalize: accept both affiliations (array, new) and affiliation (single, legacy)
      var affList = [];
      if (Array.isArray(config.affiliations) && config.affiliations.length > 0) {
        affList = config.affiliations;
      } else if (config.affiliation) {
        affList = [config.affiliation];
      }

      if (affList.length === 0) {
        affEl.style.display = 'none';
      } else {
        var fullHtml = '<div class="aff-line">' + (t['about.affiliationLabel'] || 'Vínculo institucional') + '</div>';
        affList.forEach(function (aff, idx) {
          fullHtml += '<div class="aff-block" data-aff="' + idx + '">';

          // Logo (if exists) — each block gets its own slot id
          var slotId = 'aff-logo-slot-' + idx;
          if (aff.logo) {
            fullHtml += '<div class="aff-logo-slot" id="' + slotId + '"></div>';
            (function (aff, slotId) {
              var logoImg = new Image();
              logoImg.onload = function () {
                var logoHtml = '';
                if (aff.url) {
                  logoHtml = '<a href="' + aff.url + '" target="_blank" rel="noopener" class="aff-logo-link">';
                  logoHtml += '<img src="' + aff.logo + '" alt="' + (aff.labShort || '') + '" class="aff-logo">';
                  logoHtml += '</a>';
                } else {
                  logoHtml = '<img src="' + aff.logo + '" alt="' + (aff.labShort || '') + '" class="aff-logo">';
                }
                var container = document.getElementById(slotId);
                if (container) container.innerHTML = logoHtml;
              };
              logoImg.onerror = function () {
                var container = document.getElementById(slotId);
                if (container) container.style.display = 'none';
              };
              logoImg.src = aff.logo;
            })(aff, slotId);
          }

          fullHtml += '<div class="aff-text">';
          fullHtml += '<div class="aff-role">' + aff.role + '</div>';
          fullHtml += '<div class="aff-lab">' + aff.lab + (aff.labShort ? ' (' + aff.labShort + ')' : '') + '</div>';
          fullHtml += '<div class="aff-period">' + aff.period + '</div>';
          fullHtml += '</div>'; // aff-text
          fullHtml += '</div>'; // aff-block
        });
        affEl.innerHTML = fullHtml;
      }
    }
  }

  function renderResearchKeywords(t) {
    var container = document.getElementById('research-keywords');
    if (!container || !config.researchAgenda) return;
    var keywords = config.researchAgenda.keywords || [];
    var html = keywords.map(function (kw, i) {
      var key = 'research.keywords.' + i;
      return '<span class="keyword">' + (t[key] || kw) + '</span>';
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

  // --- Records (Registros da trajetória) ---

  function renderRecords(t) {
    var container = document.getElementById('records-container');
    var section = document.getElementById('records');
    if (!container || !section) return;
    if (records.length === 0) {
      hideSection('records');
      return;
    }
    section.removeAttribute('hidden');

    // Assymetric layout: first record is "featured" (larger), rest are smaller
    var html = '<div class="records-grid">';
    records.forEach(function (r, i) {
      var isFeatured = (i === 0 && records.length > 1);
      var cls = isFeatured ? 'record-card record-featured' : 'record-card';
      
      // Detect if image exists; if not, skip this record entirely
      // (image check happens at render time — if 404, the card is hidden)
      var cardId = 'record-' + i;
      var rt = function (field) { return t['records.' + i + '.' + field] || r[field] || ''; };

      html += '<figure class="' + cls + ' reveal" id="' + cardId + '">';
      html += '<div class="record-image-wrap">';
      if (r.link) {
        html += '<a href="' + r.link + '" target="_blank" rel="noopener">';
      }
      html += '<img src="' + r.image + '" alt="' + (rt('alt') || rt('title') || '') + '" class="record-img" loading="lazy">';
      if (r.link) {
        html += '</a>';
      }
      html += '</div>';
      html += '<figcaption class="record-caption">';
      if (r.title) html += '<div class="record-title">' + rt('title') + '</div>';
      var meta = '';
      if (r.context) meta += rt('context');
      if (r.year) meta += (meta ? ' · ' : '') + r.year;
      if (meta) html += '<div class="record-meta">' + meta + '</div>';
      if (r.caption) html += '<p class="record-desc">' + rt('caption') + '</p>';
      html += '</figcaption>';
      html += '</figure>';
    });
    html += '</div>';

    container.innerHTML = html;

    // Hide cards whose image failed to load
    records.forEach(function (r, i) {
      var check = new Image();
      check.onerror = function () {
        var card = document.getElementById('record-' + i);
        if (card) card.style.display = 'none';
      };
      check.src = r.image;
    });
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
      var tags = (p.tags || []).map(function (tag, i) {
        var tagKey = 'projects.' + p.id + '.tags.' + i;
        return '<span class="project-tag">' + (t[tagKey] || tag) + '</span>';
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
      html += '<ul class="method-list">' + methods.map(function (m, i) {
        var key = 'methods.list.' + i;
        return '<li>' + (t[key] || m) + '</li>';
      }).join('') + '</ul></div>';
    }
    if (tools.length > 0) {
      html += '<div class="method-group"><h3>' + (t['methods.tools'] || 'Ferramentas') + '</h3>';
      html += '<ul class="method-list">' + tools.map(function (tool, i) {
        var key = 'tools.list.' + i;
        return '<li>' + (t[key] || tool) + '</li>';
      }).join('') + '</ul></div>';
    }
    container.innerHTML = html;
  }

  function renderContact(t) {
    var container = document.getElementById('contact-container');
    var section = document.getElementById('contact');
    if (!container || !section) return;
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

  function hideSection(id) {
    var section = document.getElementById(id);
    if (section) section.setAttribute('hidden', '');
  }

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

  function addRevealClass() {
    document.querySelectorAll('.section-header, .timeline-item, .project-card, .pub-entry, .method-group, .record-card, .hero-inner > *').forEach(function (el) {
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