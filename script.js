// 懒得整了为了开发方便将就一下
const languageMap = {
    "暗": "dark",
    "亮": "light",
    "点击切换为": "Click to switch to ",
    "色模式": " theme",
    "中文": "中文",
    "English": "English",
    "模式": " mode",
    "关于我": "About Me",
    "联系方式": "Contact Info",
    "技术栈": "Tech Stack",
    "身份标签": "Identity Tags",
    "项目集": "Project Collection",
    "合作意向": "Cooperation Intent",
    "联系方式": "Contact Info",
    "创作者 / 玩家": "Creator / Player",
    "我会尽力学习新技术": "I will try my best to learn new technologies",
    "程序员 · 学生 · 独立开发者（游戏） · 画家 · OIer · 福瑞控": "Programmer · Student · Independent Developer (Game) · Artist · OIer · Furry Enthusiast",
    "· fxn 系列 — 独立项目集，个人脑洞的落地场": "· fxn Series - Independent Project Collection, a place for personal ideas to come to life",
    "· fxx 系列 — 合作项目集（目前架构已定，内容待填充，期待你的加入）": "· fxx Series - Collaborative Project Collection (currently structured, content to be filled, looking forward to your participation)",
    "我信奉“1+1 > 2”，也享受与不同视角的人碰撞火花。": "I believe in '1+1 > 2' and enjoy the sparks that come from interacting with people with different perspectives.",
    "无论你是想共建 fxx，还是另有奇思妙想——": "Whether you want to co-build fxx or have other creative ideas—",
    "QQ 备注“合作”单开一行，再添加具体内容，我们细聊。": "Please send a QQ message with 'Cooperation' in the subject line, and add specific details for further discussion.",
    "假期较为活跃，空余充足，随时可开工。": "I am quite active during holidays, with plenty of free time, ready to start work at any time.",
    "⚠️ 文案经过 DeepSeek 润色": "⚠️ The copy has been polished by DeepSeek",
};

var languageMapInv = {};

for (const key in languageMap) {
    languageMapInv[languageMap[key]] = key;
}

var usingLanguage = '中文';

// 
function addContactInfo(name, info, link) {
    const contactInfo = document.getElementById('contact-info');
    // Add contact info dynamically if needed
    contactInfo.innerHTML += `
        <a href="${link}" target="_blank" rel="noopener noreferrer">
            <button class="block-button">
                <img src="img/${name}.svg" alt="${name} Logo" class="button-icon">
                <div class="button-text">
                    <span class="button-p-name">
                        <span>${name}</span>
                        <img src="img/link.svg" alt="open..." class="link-img button-icon">
                    </span>
                    <br>
                    <span class="button-info-text">${info}</span>
                </div>
            </button>
        </a>
    `;
}

addContactInfo("Github", "HXB-XXB", "https://github.com/HXB-XXB");
addContactInfo("QQ", "xxb", "img/qq.png");
addContactInfo("Bilibili", "_xxb_", "https://b23.tv/Z5S4Zgw");

document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('light');
    const themeName = document.getElementById('themeName');
    const themeNameInv = document.getElementById('themeNameInv');
    const themeIcon = document.getElementById('themeIcon');
    if (document.body.classList.contains('light')) {
        themeName.textContent = (usingLanguage == 'English' ? 'light' : '亮');
        themeNameInv.textContent = (usingLanguage == 'English' ? 'dark' : '暗');
        themeIcon.src = 'img/sun.svg';
        themeIcon.alt = 'light';
    } else {
        themeName.textContent = (usingLanguage == 'English' ? 'dark' : '暗');
        themeNameInv.textContent = (usingLanguage == 'English' ? 'light' : '亮');
        themeIcon.src = 'img/moon.svg';
        themeIcon.alt = 'dark';
    }
});

document.getElementById('lang-toggle').addEventListener('click', function() {
    usingLanguage = usingLanguage === '中文' ? 'English' : '中文';
    document.getElementById('langName').textContent = usingLanguage;
    document.getElementById('langNameInv').textContent = (usingLanguage == 'English' ? '中文' : 'English');
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.textContent;
        if(usingLanguage !== 'English') element.textContent = languageMapInv[key];
        else element.textContent = languageMap[key];
    });
    document.querySelectorAll('[data-lang-inv]').forEach(element => {
        const key = element.textContent;
        if(usingLanguage == 'English') element.textContent = languageMapInv[key];
        else element.textContent = languageMap[key];
    });
});