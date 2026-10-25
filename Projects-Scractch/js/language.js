let currentLang = 'zh';

const LANG_STORAGE_KEY = 'xxb-site-lang';

function loadLangFromStorage() {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && TRANSLATIONS[saved]) {
        currentLang = saved;
    }
}

function saveLangToStorage() {
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
}

function getLang() {
    return TRANSLATIONS[currentLang];
}

function getCurrentLang() {
    return currentLang;
}

function toggleLang() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    saveLangToStorage();
    return currentLang;
}

function setLang(lang) {
    if (TRANSLATIONS[lang]) {
        currentLang = lang;
        saveLangToStorage();
    }
}

loadLangFromStorage();