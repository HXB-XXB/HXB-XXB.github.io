const themeToggle = document.getElementById('themeToggle');
const body = document.body;

setTimeout(() => {
    document.querySelector(".curtain").remove();
}, 2000);

function setTheme(mode) {
    if(mode === "light") {
        body.classList.remove('darkMode');
        body.classList.add('lightMode');
        themeToggle.querySelector("span").textContent = '切换暗色模式';
        themeToggle.querySelector("div").className = 'sun';
        // document.getElementById("anotherMark").src = "icon/dark/github.svg";
        document.getElementById("emailMark").src = "icon/dark/email.svg";
        document.getElementById("githubMark").src = "icon/dark/github.svg";
        document.getElementById("githubMark2").src = "icon/dark/github.svg";
        document.getElementById("wechatMark").src = "icon/dark/wechat.svg";
        document.querySelectorAll(".emoji").forEach((e) => {
            e.style.setProperty('--inv', `0%`);
        })
        localStorage.setItem('theme', 'light');
    }
    else {
        body.classList.remove('lightMode');
        body.classList.add('darkMode');
        themeToggle.querySelector("span").textContent = '切换亮色模式';
        themeToggle.querySelector("div").className = 'moon';
        // document.getElementById("anotherMark").src = "icon/light/github.svg";
        document.getElementById("emailMark").src = "icon/light/email.svg";
        document.getElementById("githubMark").src = "icon/light/github.svg";
        document.getElementById("githubMark2").src = "icon/light/github.svg";
        document.getElementById("wechatMark").src = "icon/light/wechat.svg";
        document.querySelectorAll(".emoji").forEach((e) => {
            e.style.setProperty('--inv', `100%`);
        })
        localStorage.setItem('theme', 'dark');
    }
}
    
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    setTheme("light");
}
else {
    setTheme("dark");
}
    
themeToggle.addEventListener('click', function() {
    if (body.classList.contains('darkMode')) {
        setTheme("light");
    }
    else {
        setTheme("dark");
    }
});
    
themeToggle.addEventListener('mouseenter', function() {
    themeToggle.querySelector("span").style.opacity = "1";
});
themeToggle.addEventListener('mouseleave', function() {
    themeToggle.querySelector("span").style.opacity = "0";
});

function copyTxt(txt) {
    navigator.clipboard.writeText(txt);
    showTips('复制成功');
}

function showTips(txt) {
    // 创建提示元素
    const tips = document.createElement('div');
    tips.textContent = txt;
    tips.className = "tips";
    document.body.appendChild(tips);

    setTimeout(() => {
        tips.classList.add("tipsShow");
    }, 10);
    
    setTimeout(() => {
        tips.classList.remove("tipsShow");
        setTimeout(() => {
            document.body.removeChild(tips);
        }, 500);
    }, 3000);
}