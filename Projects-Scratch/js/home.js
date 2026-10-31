// home.js
// 首页渲染、搜索、语言切换按钮绑定

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getProjectText(project) {
    const localized = project.translations?.[getCurrentLang()] || {};
    return {
        title: localized.title || project.title || '',
        description: localized.description || project.description || ''
    };
}

function updatePageText() {
    const lang = getLang();

    document.title = lang.title;
    document.documentElement.lang = getCurrentLang();
    document.getElementById('theme-button')?.setAttribute('aria-label', lang.theme);
    document.getElementById('language-button')?.setAttribute('aria-label', lang.language);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.placeholder = lang.searchPlaceholder;
    }

    updateNoFindText();
}

function updateNoFindText() {
    const noFindText = document.getElementById('no-find-text');
    if (noFindText) {
        noFindText.textContent = getLang().noFindText;
    }
}

function renderProjects() {
    const container = document.getElementById('project-container');
    if (!container) return;

    container.innerHTML = '';

    const lang = getLang();

    PROJECTS.forEach((project) => {
        const text = getProjectText(project);
        const card = document.createElement('div');
        card.className = 'project-card';

        card.innerHTML = `
            <div class="project-card-image">
                <img src="img/project/${escapeHtml(project.image)}" alt="${escapeHtml(text.title)}">
            </div>
            <div class="project-card-content">
                <h2 class="project-card-title">${escapeHtml(text.title)}</h2>
                <div class="project-card-description">
                    <div class="project-card-description-content">
                        <p>${text.description}</p>
                    </div>
                </div>
                <div class="project-card-right-bottom">
                    <button class="project-card-button">
                        <p>${escapeHtml(lang.downloadProject)}</p>
                        <div class="project-card-button-icon">
                            <img src="img/download.svg">
                        </div>
                    </button>
                </div>
            </div>
        `;

        const button = card.querySelector('.project-card-button');
        if (button && project.link) {
            button.addEventListener('click', () => {
                const target = new URL(project.link, document.baseURI);
                target.searchParams.set('project', project.key);
                window.location.href = target.href;
            });
        } else if (button) {
            button.disabled = true;
        }

        container.appendChild(card);
    });
}

function filterProjects() {
    const searchInput = document.getElementById('search-input');
    const noFindText = document.getElementById('no-find-text');
    if (!searchInput) return;

    const keyword = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll('#project-container .project-card');
    let visibleCount = 0;

    cards.forEach((card) => {
        const title = card.querySelector('.project-card-title')?.textContent || '';
        const desc = card.querySelector('.project-card-description-content p')?.textContent || '';
        const match = !keyword ||
            title.toLowerCase().includes(keyword) ||
            desc.toLowerCase().includes(keyword);

        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });

    if (noFindText) {
        noFindText.style.display = visibleCount === 0 ? '' : 'none';
    }
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    updateNoFindText();

    searchInput.removeEventListener('input', filterProjects);
    searchInput.addEventListener('input', filterProjects);

    filterProjects();
    searchInput.focus();
}

function refreshHome() {
    updatePageText();
    renderProjects();
    setupSearch();
}

function setupLanguageButton() {
    const btn = document.getElementById('language-button');
    if (!btn) return;

    btn.addEventListener('click', () => {
        toggleLang();
        refreshHome();
    });
}

function initHome() {
    setupLanguageButton();
    loadProjects()
        .then(refreshHome)
        .catch((error) => {
            console.error(error);
            const noFindText = document.getElementById('no-find-text');
            if (noFindText) {
                noFindText.textContent = getLang().projectLoadError;
                noFindText.style.display = '';
            }
        });
}

initHome();