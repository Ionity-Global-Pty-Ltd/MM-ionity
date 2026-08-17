/* ============================================================
   MojaMind — Multi-language engine (MMI18n) 🌍
   Optional, user-selectable UI language from the Settings gear.
   All 11 official South African languages are selectable.

   IMPORTANT — clinical safety:
   • Survey content is NEVER translated here. It stays in the
     validated English exactly as transcribed, to protect the
     study's measurement validity until native-reviewed,
     professionally-approved survey translations are supplied.
   • English + Afrikaans UI strings are complete & reliable.
   • The other 9 languages ship a confident CORE set; any key
     without a translation falls back to English automatically
     (never blank). These are marked DRAFT — pending review by
     native speakers before real-study use.

   © IONITY Global (Pty) Ltd · Johan Wilhelm van Antwerp
   ============================================================ */
'use strict';

const MMI18n = (() => {
  const KEY = 'mm_lang';

  /* The 11 official languages of South Africa (text). SASL is a
     signed language and is not a text UI option. */
  const LANGS = [
    { code: 'en',  native: 'English',    en: 'English',      draft: false },
    { code: 'af',  native: 'Afrikaans',  en: 'Afrikaans',    draft: false },
    { code: 'zu',  native: 'isiZulu',    en: 'Zulu',         draft: true },
    { code: 'xh',  native: 'isiXhosa',   en: 'Xhosa',        draft: true },
    { code: 'nr',  native: 'isiNdebele', en: 'Ndebele',      draft: true },
    { code: 'nso', native: 'Sepedi',     en: 'Northern Sotho', draft: true },
    { code: 'st',  native: 'Sesotho',    en: 'Sotho',        draft: true },
    { code: 'tn',  native: 'Setswana',   en: 'Tswana',       draft: true },
    { code: 'ss',  native: 'siSwati',    en: 'Swati',        draft: true },
    { code: 've',  native: 'Tshivenḓa',  en: 'Venda',        draft: true },
    { code: 'ts',  native: 'Xitsonga',   en: 'Tsonga',       draft: true },
  ];

  /* ── UI dictionary. English is the base (complete). ───────── */
  const STR = {
    en: {
      'nav.home': 'Home', 'nav.games': 'Games', 'nav.journal': 'Journal',
      'nav.support': 'Support', 'nav.art': 'Art', 'nav.chat': 'Chat',
      'ui.settings': 'Settings', 'ui.language': 'Language', 'ui.help': 'Help',
      'ui.save': 'Save', 'ui.next': 'Next', 'ui.done': 'Done', 'ui.back': 'Back',
      'ui.continue': 'Continue', 'ui.submit': 'Submit', 'ui.close': 'Close',
      'ui.start': 'Start', 'ui.reflect': 'Reflect',
      'tip.soundscape': '432Hz Audio', 'tip.voice': 'Voice Studio',
      'tip.a11y': 'Accessibility', 'tip.care': 'Hope Sanctuary',
      'tip.help': 'Help & FAQ', 'tip.spark': 'Daily Spark',
      'tip.release': 'Cosmic Release', 'tip.language': 'Language',
      'toast.preLock': 'Complete your Pre-Survey to unlock this ✨',
      'lang.title': 'Choose your language', 'lang.system': 'App language',
      'lang.subtitle': 'This changes the app menus and buttons. Surveys stay in English to keep the study accurate.',
      'lang.draft': 'Draft — pending review by a first-language speaker',
      'lang.saved': 'Language updated 🌍',
    },
    af: {
      'nav.home': 'Tuis', 'nav.games': 'Speletjies', 'nav.journal': 'Joernaal',
      'nav.support': 'Ondersteuning', 'nav.art': 'Kuns', 'nav.chat': 'Klets',
      'ui.settings': 'Instellings', 'ui.language': 'Taal', 'ui.help': 'Hulp',
      'ui.save': 'Stoor', 'ui.next': 'Volgende', 'ui.done': 'Klaar', 'ui.back': 'Terug',
      'ui.continue': 'Gaan voort', 'ui.submit': 'Dien in', 'ui.close': 'Maak toe',
      'ui.start': 'Begin', 'ui.reflect': 'Besin',
      'tip.soundscape': '432Hz Klank', 'tip.voice': 'Stemstudio',
      'tip.a11y': 'Toeganklikheid', 'tip.care': 'Hoop-heiligdom',
      'tip.help': 'Hulp & Vrae', 'tip.spark': 'Daaglikse Vonk',
      'tip.release': 'Kosmiese Vrylating', 'tip.language': 'Taal',
      'toast.preLock': 'Voltooi jou Voor-opname om dit te ontsluit ✨',
      'lang.title': 'Kies jou taal', 'lang.system': 'Programtaal',
      'lang.subtitle': 'Dit verander die kieslyste en knoppies. Opnames bly in Engels om die studie akkuraat te hou.',
      'lang.draft': 'Konsep — wag vir nasien deur ’n moedertaalspreker',
      'lang.saved': 'Taal opgedateer 🌍',
    },
    /* ── Confident CORE sets for the remaining official languages.
       Missing keys fall back to English automatically. ──────── */
    zu: {
      'nav.home': 'Ikhaya', 'nav.games': 'Imidlalo', 'nav.journal': 'Ijenali',
      'nav.support': 'Usekelo', 'nav.art': 'Ubuciko', 'nav.chat': 'Ingxoxo',
      'ui.settings': 'Izilungiselelo', 'ui.language': 'Ulimi', 'ui.help': 'Usizo',
      'ui.save': 'Gcina', 'ui.next': 'Okulandelayo', 'ui.back': 'Emuva', 'ui.close': 'Vala',
      'tip.language': 'Ulimi', 'lang.title': 'Khetha ulimi lwakho', 'lang.saved': 'Ulimi lubuyekeziwe 🌍',
    },
    xh: {
      'nav.home': 'Ikhaya', 'nav.games': 'Imidlalo', 'nav.journal': 'Ijenali',
      'nav.support': 'Inkxaso', 'nav.art': 'Ubugcisa', 'nav.chat': 'Incoko',
      'ui.language': 'Ulwimi', 'ui.help': 'Uncedo', 'ui.save': 'Gcina',
      'ui.next': 'Okulandelayo', 'ui.back': 'Emva', 'ui.close': 'Vala',
      'tip.language': 'Ulwimi', 'lang.title': 'Khetha ulwimi lwakho', 'lang.saved': 'Ulwimi luhlaziyiwe 🌍',
    },
    nr: {
      'nav.home': 'Ikhaya', 'nav.games': 'Imidlalo', 'nav.art': 'Ubuciko',
      'ui.language': 'Ilimi', 'ui.help': 'Usizo', 'ui.save': 'Gcina', 'ui.back': 'Emuva',
      'tip.language': 'Ilimi', 'lang.title': 'Khetha ilimi lakho',
    },
    nso: {
      'nav.home': 'Gae', 'nav.games': 'Dipapadi', 'nav.support': 'Thekgo',
      'nav.art': 'Bokgabo', 'nav.chat': 'Poledišano',
      'ui.language': 'Leleme', 'ui.help': 'Thušo', 'ui.save': 'Boloka', 'ui.back': 'Morago',
      'tip.language': 'Leleme', 'lang.title': 'Kgetha leleme la gago',
    },
    st: {
      'nav.home': 'Hae', 'nav.games': 'Lipapali', 'nav.support': 'Tshehetso',
      'nav.art': 'Bonono', 'nav.chat': 'Puisano',
      'ui.language': 'Puo', 'ui.help': 'Thuso', 'ui.save': 'Boloka', 'ui.back': 'Morao',
      'tip.language': 'Puo', 'lang.title': 'Khetha puo ya hao',
    },
    tn: {
      'nav.home': 'Gae', 'nav.games': 'Metshameko', 'nav.support': 'Tshegetso',
      'nav.art': 'Botaki', 'nav.chat': 'Puisano',
      'ui.language': 'Puo', 'ui.help': 'Thuso', 'ui.save': 'Boloka', 'ui.back': 'Morago',
      'tip.language': 'Puo', 'lang.title': 'Tlhopha puo ya gago',
    },
    ss: {
      'nav.home': 'Ekhaya', 'nav.games': 'Imidlalo', 'nav.support': 'Lusito',
      'nav.art': 'Buciko', 'nav.chat': 'Kuchumana',
      'ui.language': 'Lulwimi', 'ui.help': 'Lusito', 'ui.save': 'Gcina', 'ui.back': 'Emuva',
      'tip.language': 'Lulwimi', 'lang.title': 'Khetsa lulwimi lwakho',
    },
    ve: {
      'nav.home': 'Hayani', 'nav.games': 'Mitambo', 'nav.support': 'Thikhedzo',
      'nav.art': 'Vhutsila', 'nav.chat': 'Nyambedzano',
      'ui.language': 'Luambo', 'ui.help': 'Thuso', 'ui.save': 'Vhulunga', 'ui.back': 'Murahu',
      'tip.language': 'Luambo', 'lang.title': 'Nangani luambo lwaṋu',
    },
    ts: {
      'nav.home': 'Kaya', 'nav.games': 'Mintlangu', 'nav.support': 'Nseketelo',
      'nav.art': 'Vutshila', 'nav.chat': 'Mbulavurisano',
      'ui.language': 'Ririmi', 'ui.help': 'Mpfuno', 'ui.save': 'Hlayisa', 'ui.back': 'Endzhaku',
      'tip.language': 'Ririmi', 'lang.title': 'Hlawula ririmi ra wena',
    },
  };

  /* ── Activity titles (Afrikaans). Other languages fall back to
     the English name from data.js. Survey content is untouched. ── */
  const ACT = {
    af: {
      1: 'Selfportret', 2: 'My Veilige Plek', 3: 'My Familie', 4: 'My Reis',
      5: 'My Tuiste', 6: 'Visiebord', 7: 'Brief aan Myself', 8: 'My Lied van Krag',
    },
  };

  let lang = 'en';
  const listeners = [];

  function normalise(code) { return LANGS.some(l => l.code === code) ? code : 'en'; }

  function load() {
    try { lang = normalise(localStorage.getItem(KEY) || 'en'); } catch (_) { lang = 'en'; }
    applyDocLang();
    return lang;
  }
  function applyDocLang() { try { document.documentElement.setAttribute('lang', lang); } catch (_) {} }

  function t(key) {
    const l = STR[lang];
    return (l && l[key] != null) ? l[key] : (STR.en[key] != null ? STR.en[key] : key);
  }

  /* Translated activity name (falls back to the English name given). */
  function actName(id, fallback) {
    const m = ACT[lang];
    return (m && m[id]) ? m[id] : fallback;
  }

  function setLang(code) {
    lang = normalise(code);
    try { localStorage.setItem(KEY, lang); } catch (_) {}
    applyDocLang();
    listeners.forEach(fn => { try { fn(lang); } catch (_) {} });
    return lang;
  }

  function onChange(fn) { if (typeof fn === 'function') listeners.push(fn); }
  function current() { return lang; }
  function meta(code) { return LANGS.find(l => l.code === (code || lang)); }
  function isDraft(code) { const m = meta(code); return !!(m && m.draft); }

  return { LANGS, load, t, actName, setLang, onChange, current, meta, isDraft };
})();

globalThis.MMI18n = MMI18n;
try { MMI18n.load(); } catch (_) {}
