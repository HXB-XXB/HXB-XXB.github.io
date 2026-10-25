let isDarkMode = localStorage.getItem("isDarkMode") !== "false";

function applyTheme() {
    if (isDarkMode) {
        document.body.classList.remove("light-mode");
        document.querySelector(".theme-logo").src = "img/moon.svg";
    } else {
        document.body.classList.add("light-mode");
        document.querySelector(".theme-logo").src = "img/sun.svg";
    }
}

applyTheme();

document.getElementById("theme-button").addEventListener("click", function() {
    isDarkMode = !isDarkMode;
    localStorage.setItem("isDarkMode", isDarkMode);
    applyTheme();
});