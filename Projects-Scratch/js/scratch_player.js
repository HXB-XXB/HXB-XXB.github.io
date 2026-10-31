const loadingPage = document.getElementById("loading");

const author = document.createElement("h2");
author.className = "scratch_palyer-title";
author.textContent = `By @${document.getElementById("scratch-player-script").dataset.author}`;
loadingPage.prepend(author);