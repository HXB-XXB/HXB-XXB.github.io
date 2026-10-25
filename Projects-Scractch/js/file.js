const goBackButton = document.getElementById("go-back-button");
goBackButton.addEventListener("click", () => {
    window.location.href = new URL("index.html", document.baseURI).href;
});

const runProjectButton = document.getElementById("run-project");
const params = new URLSearchParams(window.location.search);
const currentProjectKey = params.get("project") || "portal";
const loadError = document.getElementById("project-load-error");

function setProjectText(project) {
    const lang = getLang();
    const localized = project.translations?.[getCurrentLang()] || {};
    const title = localized.title || project.title || project.key;

    document.title = `${title} - ${lang.title}`;
    document.documentElement.lang = getCurrentLang();
    document.getElementById("back-label").textContent = lang.back;
    const runContent = document.getElementById("run-content");
    if(runContent) {
        document.getElementById("run-project-label").textContent = lang.runProject;
        document.getElementById("run-project-image").src = `img/project/${project.image}`;
    }
    document.getElementById("introduction-heading").textContent = lang.introduction;
    document.getElementById("license-heading").textContent = lang.license;
    document.getElementById("version-heading").textContent = lang.version;
    document.getElementById("download-heading").textContent = lang.download;
    document.getElementById("language-button").setAttribute("aria-label", lang.language);
    document.getElementById("theme-button").setAttribute("aria-label", lang.theme);
    document.getElementById("project-title").textContent = title;
    document.getElementById("project-description").innerHTML = localized.description || project.description || "";
    document.getElementById("project-details").innerHTML = localized.details || "";
    document.getElementById("project-version").textContent = project.version || "—";
    document.getElementById("project-license").textContent = project.license || "—";

    const downloads = document.getElementById("project-downloads");
    downloads.replaceChildren();
    if (!Array.isArray(project.downloads) || project.downloads.length === 0) {
        const emptyText = document.createElement("p");
        emptyText.textContent = lang.noDownloads;
        downloads.appendChild(emptyText);
        return;
    }

    project.downloads.forEach((download) => {
        const link = document.createElement("a");
        link.className = "project-download-button";
        link.href = new URL(download.path, document.baseURI).href;
        link.download = "";
        const label = download.label;
        link.textContent = typeof label === "string"
            ? label
            : label?.[getCurrentLang()] || label?.en || label?.zh || download.path;
        downloads.appendChild(link);
    });
}

function startProject(project) {
    if (!project.iframe) {
        console.warn("This project does not have a runnable page.");
        return;
    }

    const frame = document.createElement("iframe");
    frame.src = new URL(project.iframe, document.baseURI).href;
    frame.title = project.translations?.[getCurrentLang()]?.title || project.key;
    frame.onload = () => {
        const doc = frame.contentDocument;
        if (!doc) {
            console.error("Unable to access the project frame document.");
            return;
        }

        const link = doc.createElement("link");
        link.rel = "stylesheet";
        link.href = new URL("css/scratch_player.css", document.baseURI).href;
        doc.head.appendChild(link);

        const script = doc.createElement("script");
        script.dataset.author = project.author;
        script.src = new URL("js/scratch_player.js", document.baseURI).href;
        script.id = "scratch-player-script";
        doc.body.prependChild(script);
    };

    document.getElementById("project-iframe").appendChild(frame);
    document.getElementById("run-content").remove();

    frame.focus();
}

function setupFileLanguageButton(project) {
    document.getElementById("language-button").addEventListener("click", () => {
        toggleLang();
        setProjectText(project);
    });
}

async function initFile() {
    try {
        await loadProjects();
    } catch (error) {
        console.error(error);
        loadError.textContent = getLang().projectLoadError;
        loadError.hidden = false;
        return;
    }

    const project = getProjectByKey(currentProjectKey);
    if (!project) {
        loadError.textContent = getLang().projectNotFound;
        loadError.hidden = false;
        runProjectButton.hidden = true;
        return;
    }

    setProjectText(project);
    setupFileLanguageButton(project);
    runProjectButton.addEventListener("click", () => startProject(project));
}

initFile();
