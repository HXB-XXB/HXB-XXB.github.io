let isDarkMode = localStorage.getItem("isDarkMode") !== "false";

function applyTheme() {
    const backgroundContainer = document.getElementById("background-container");
    const backgroundLight = document.getElementById("background-image-light");
    const backgroundDark = document.getElementById("background-image-dark");
    if (isDarkMode) {
        document.body.classList.remove("light-mode");
        document.querySelector(".theme-logo").src = "img/moon.svg";
        if(backgroundDark) {
            backgroundDark.style.display = "block";
        }
        else {
            const backgroundDarkNew = document.createElement("img");
            backgroundDarkNew.id = "background-image-dark";
            backgroundDarkNew.src = "img/background_dark.svg";
            backgroundDarkNew.alt = "暗色背景";
            backgroundDarkNew.className = "background-author-image";
            backgroundContainer.appendChild(backgroundDarkNew);
        }
        if(backgroundLight) {
            backgroundLight.style.display = "none";
        }
    } else {
        document.body.classList.add("light-mode");
        document.querySelector(".theme-logo").src = "img/sun.svg";
        if(backgroundLight) {
            backgroundLight.style.display = "block";
        }
        else {
            const backgroundLightNew = document.createElement("img");
            backgroundLightNew.id = "background-image-light";
            backgroundLightNew.src = "img/background_light.svg";
            backgroundLightNew.alt = "亮色背景";
            backgroundLightNew.className = "background-author-image";
            backgroundContainer.appendChild(backgroundLightNew);
        }
        if(backgroundDark) {
            backgroundDark.style.display = "none";
        }
    }
}

applyTheme();

document.getElementById("theme-button").addEventListener("click", function() {
    isDarkMode = !isDarkMode;
    localStorage.setItem("isDarkMode", isDarkMode);
    applyTheme();
});