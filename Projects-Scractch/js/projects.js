let PROJECTS = [];

const TRANSLATIONS = {
    zh: {
        title: 'xxb 的小站',
        downloadProject: '项目详情与下载',
        noFindText: '什么也没有 >.< ...',
        searchPlaceholder: '搜索...',
        projectLoadError: '项目清单加载失败，请确认网站运行在支持读取 JSON 的服务器上。',
        projectNotFound: '没有找到这个项目。',
        runProject: '运行项目',
        back: '返回',
        introduction: '项目介绍',
        version: '版本',
        license: '许可证',
        download: '下载',
        noDownloads: '暂无可用下载。',
        theme: '主题切换',
        language: '切换语言'
    },
    en: {
        title: 'home of xxb',
        downloadProject: 'Details & Downloads',
        noFindText: 'No projects found >.< ..',
        searchPlaceholder: 'Search...',
        projectLoadError: 'Could not load the project list. Please run this site on a server that can serve JSON files.',
        projectNotFound: 'Project not found.',
        runProject: 'Run project',
        back: 'Back',
        introduction: 'About',
        version: 'Version',
        license: 'License',
        download: 'Downloads',
        noDownloads: 'No downloads available.',
        theme: 'Toggle theme',
        language: 'Switch language'
    }
};

async function loadProjects() {
    const response = await fetch(new URL('projects.json', document.baseURI));
    if (!response.ok) {
        throw new Error(`Failed to load projects.json: ${response.status} ${response.statusText}`);
    }

    const manifest = await response.json();
    if (!manifest || !Array.isArray(manifest.projects)) {
        throw new Error('Invalid projects.json: expected a projects array.');
    }

    const keys = new Set();
    for (const project of manifest.projects) {
        if (!project || typeof project.key !== 'string' || !project.key || keys.has(project.key)) {
            throw new Error('Invalid projects.json: every project must have a unique key.');
        }
        if (!Array.isArray(project.downloads) || project.downloads.some(download =>
            !download ||
            typeof download.path !== 'string' ||
            !download.path ||
            download.path.startsWith('/') ||
            /^[a-z][a-z\d+.-]*:/i.test(download.path)
        )) {
            throw new Error(`Invalid projects.json: downloads for "${project.key}" must use local relative paths.`);
        }
        keys.add(project.key);
    }

    PROJECTS = manifest.projects;
    return PROJECTS;
}

function getProjectByKey(key) {
    return PROJECTS.find(project => project.key === key) || null;
}
