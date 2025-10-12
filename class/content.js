const themeToggle = document.getElementById('themeToggle');
const body = document.body;

let mouse = {
    x: 0,
    y: 0
}

setTimeout(() => {
    document.querySelector(".curtain").remove();
}, 2000);

function addWorks(url, name, tags) {
    let ul = document.getElementById("worksList");
    let li = document.createElement("li");

    function addTags(className, txt) {
        let tag = document.createElement("div");
        tag.className = className;
        let span = document.createElement("span");
        span.style.transition = "all 0.3s ease";
        span.style.opacity = "0";
        span.textContent = txt;
        tag.appendChild(span);
        li.appendChild(tag);
        tag.addEventListener("mouseenter", () => {
            tag.style.width = `${span.offsetWidth}px`;
            span.style.opacity = "1";
            tag.style.padding = "5px";
            tag.style.margin = "0";
        });
        tag.addEventListener("mouseleave", () => {
            tag.style.width = `20px`;
            span.style.opacity = "0";
            tag.style.padding = "0";
            tag.style.margin = "5px";
        });
    }
    if(tags.web) addTags("tagWeb", "浏览器拓展");
    if(tags.js) addTags("tagJs", "JavaScript");
    if(tags.html) addTags("tagHtml", "HTML");
    if(tags.cpp) addTags("tagCpp", "C++");
    if(tags.cp) addTags("tagCp", "C#");
    if(tags.c) addTags("tagC", "C");
    if(tags.other) addTags("tagOther", "其他");

    const link = document.createElement("a");
    link.href = url;
    link.style.marginLeft = "10px";
    link.textContent = name;
    li.appendChild(link);
    ul.appendChild(li);
}

function addUserLink(name, links = []) {
    const div = document.getElementById("userLinkData");

    const userLinkMenuTitle = document.createElement("h3");
    userLinkMenuTitle.innerHTML = `
        <h3 class="userMenuTxt">${name}&nbsp;<span>▶</span></h3>
    `
    userLinkMenuTitle.querySelector("span").className = "userMenuBtn";
    div.appendChild(userLinkMenuTitle);

    const userLinkMenu = document.createElement("ul");
    userLinkMenu.className = "socialLinks userMenuHide";
    userLinkMenu.style.height = `${links.length * 33.59375}px`;
    div.appendChild(userLinkMenu);

    for(let i = 0; i < links.length; i++) {
        userLinkMenu.innerHTML += `
            <li>
                ${links[i][0]}: <a href="${links[i][2]}">${links[i][1]}</a>
            </li>
        `
    }

    userLinkMenuTitle.addEventListener("click", () => {
        if(userLinkMenu.classList.contains("userMenuHide")) {
            userLinkMenu.classList.remove("userMenuHide");
            userLinkMenuTitle.querySelector("span").style.transform = "rotate(90deg)";
        }
        else {
            userLinkMenu.classList.add("userMenuHide");
            userLinkMenuTitle.querySelector("span").style.transform = "rotate(0deg)";
        }
    })
}

function setTheme(mode) {
    if(mode === "light") {
        body.classList.remove('darkMode');
        body.classList.add('lightMode');
        themeToggle.querySelector("span").textContent = '切换暗色模式';
        themeToggle.querySelector("div").className = 'sun';
        document.getElementById("authorMark").src = "icon/dark/github.svg";
        document.getElementById("emailMark").src = "icon/dark/email.svg";
        document.getElementById("githubMark").src = "icon/dark/github.svg";
        document.getElementById("githubMark2").src = "icon/dark/github.svg";
        document.getElementById("wechatMark").src = "icon/dark/wechat.svg";
        localStorage.setItem('theme', 'light');
    }
    else {
        body.classList.remove('lightMode');
        body.classList.add('darkMode');
        themeToggle.querySelector("span").textContent = '切换亮色模式';
        themeToggle.querySelector("div").className = 'moon';
        document.getElementById("authorMark").src = "icon/light/github.svg";
        document.getElementById("emailMark").src = "icon/light/email.svg";
        document.getElementById("githubMark").src = "icon/light/github.svg";
        document.getElementById("githubMark2").src = "icon/light/github.svg";
        document.getElementById("wechatMark").src = "icon/light/wechat.svg";
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

let animID;

function setTips() {
    const tips = document.getElementById("mouseTips");
    tips.style.left = `${mouse.x}px`;
    tips.style.top = `${mouse.y}px`;
    animID =  requestAnimationFrame(setTips);
}

document.querySelectorAll(".copy").forEach((e) => {
    const tips = document.getElementById("mouseTips");
    e.addEventListener("mouseenter", () => {
        animID =  requestAnimationFrame(setTips);
        tips.style.opacity = "1";
    });
    e.addEventListener("mouseleave", () => {
        cancelAnimationFrame(animID);
        tips.style.opacity = "0";
    });
});

function copyTxt(type) {
    let txt;
    if(type === "email") {
        txt = `${(4640817590 * 3 - 1).toString()}@${55 * 3 - 2}.com`;
    }
    else if(type === "wechat") {
        txt = `${("bxh").split('').reverse().join('_')}_${1974 + Number(("83").split('').reverse().join(''))}`;
    }
    navigator.clipboard.writeText(txt);
    showTips('复制成功');
}

function showTips(txt) {
    // 创建提示元素
    const tips = document.createElement('div');
    tips.innerHTML = txt;
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

document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})

document.querySelectorAll("section").forEach((e) => {
    e.addEventListener("click", () => {
        let div = document.createElement("div");
        div.className = "curtainDiv";
        e.appendChild(div);
        let curtain = document.createElement("div");
        curtain.className = "curtainRound";
        curtain.style.left = `${mouse.x - e.offsetLeft + window.scrollX - 20}px`;
        curtain.style.top = `${mouse.y - e.offsetTop + window.scrollY - e.offsetHeight + 20}px`;
        div.insertBefore(curtain, div.firstChild);
        setTimeout(() => {
            div.remove();
        }, 2000)
    })
})
document.querySelectorAll("button").forEach((e) => {
    e.addEventListener("click", () => {
        let div = document.createElement("div");
        div.className = "curtainDiv";
        e.appendChild(div);
        let curtain = document.createElement("div");
        curtain.className = "curtainRound";
        curtain.style.left = `${mouse.x - e.offsetLeft - 20}px`;
        curtain.style.top = `${mouse.y - e.offsetTop - 25}px`;
        curtain.style.backgroundColor = "#414141";
        div.insertBefore(curtain, div.firstChild);
        setTimeout(() => {
            div.remove();
        }, 2000)
    })
})

window.addEventListener('scroll', () => {
    document.getElementById("bgImg").style.setProperty("--pageY", `${-window.pageYOffset * 0.5}px`);
});

addWorks("#about", "暂无", {
    web: false,
    js: false,
    html: false,
    cpp: false,
    cp: false,
    c: false,
    other: true,
});

addUserLink("xxb", [
    ["GitHub", "HXB-XXB", "https://github.com/HXB-XXB"],
    ["洛谷", "xxb", "https://www.luogu.com.cn/user/1432908"],
    ["小木屋", "xxb", "https://world.xiaomawang.com/w/person/project/all/3972443"],
    ["BiliBili", "xxb", "https://space.bilibili.com/3546924904876904?spm_id_from=333.337.0.0"],
]);

function updateDate() {
    const now = new Date();

    const examDate = new Date(2028, 5, 29);

    const time = new Date();
    const diff = examDate - now;
            
    if (diff < 0) {
        document.getElementById("zkTimer").textContent = `Holy Shit! 考完力!`;
        return;
    }
            
    // 计算各时间单位
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // 计算年和剩余天数
    const years = Math.floor(totalDays / 365);
    const days = totalDays % 365;
            
    // 更新显示
    document.getElementById("zkTimer").textContent = `${years}年${days}天${hours}时${minutes}分${seconds}秒`;
}

updateDate();
setInterval(() => {updateDate()}, 1000);