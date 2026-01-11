/* =======================
   基础工具 & 状态管理
======================= */
const $ = id => document.getElementById(id);
const dom = {
    left: $("left"),
    visual: $("visual"),
    canvas: $("heroCanvas"),
    projectImage: $("projectImage"),
    status: $("status"),
    portraitWarning: $("portraitWarning"),
    fullscreenBtn: $("fullscreenBtn"),
    continueBtn: $("continueBtn")
};
const state = {
    pageIndex: 0,
    subProject: null,
    locked: false,
    portrait: {
        shown: false,
        ignored: false
    }
};

/* =======================
   动画系统
======================= */
const MOTION = {
    duration: 420,
    ease(t) {
        return t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
};
async function smoothTo(el, fromX, toX, fromO, toO) {
    el.style.willChange = "transform, opacity";
    try {
        return await new Promise(resolve => {
            let start = null;
            function step(ts) {
                if (!start) start = ts;
                const p = Math.min((ts - start) / MOTION.duration, 1);
                const e = MOTION.ease(p);
                el.style.transform = `translateX(${fromX + (toX - fromX) * e}px)`;
                el.style.opacity = fromO + (toO - fromO) * e;
                p < 1 ? requestAnimationFrame(step) : resolve();
            }
            requestAnimationFrame(step);
        });
    } finally {
        el.style.willChange = "auto";
    }
}
function revealText(container) {
    [...container.children].forEach((el, i) => {
        el.style.transition = "opacity .45s ease, transform .45s ease";
        el.style.transitionDelay = `${i * 60}ms`;
        requestAnimationFrame(() => {
            el.style.opacity = 1;
            el.style.transform = "translateY(0)";
        });
    });
}

/* =======================
   数据
======================= */
const projects = {
    mc: {
        title: "WS实现视频转MC指令 #py #mc",
        desc: "使用 WebSocket 在 MC 基岩版中播放视频。<br>https://gitee.com/XiaoFengQWQ/mc-websocket-player",
        image: "https://s41.ax1x.com/2026/01/10/pZ0GMjJ.png"
    },
    xqfchat: {
        title: "XQFChatRoom #php #chat",
        desc: "基于 PHP 的简易聊天室。",
        image: "https://s41.ax1x.com/2026/01/10/pZ0G28S.png"
    },
    XQFWebMusicPlayer: {
        title: "XQFWebMusicPlayer #js #music",
        desc: "APlayer + 自定义设置的网页音乐播放器。",
        image: "https://s21.ax1x.com/2025/07/20/pV8nm9K.png"
    }
};
const pages = [
    () => `
        <div class="hero-title avatar-section">
            <img class="avatar-img" src="https://q.qlogo.cn/headimg_dl?dst_uin=1432777209&spec=640">
            <h1>你好，我是小枫_QWQ</h1>
        </div>
        <div class="hero-desc">
            <p>业余网页开发者</p>
            <p>前端 / 后端 / 工程化实践</p>
        </div>
    `,
    () => `
        <div class="section">
            <h2>项目</h2>
            <ul class="projects">
                ${Object.entries(projects).map(([id, p]) =>
        `<li data-id="${id}">${p.title}</li>`
    ).join("")}
            </ul>
        </div>`,
    () => `
        <div class="section">
            <h2>联系方式</h2>
            <div class="contact-list">
                <div class="contact-item"><i class="fas fa-envelope"></i><p>1432777209@qq.com</p></div>
                <div class="contact-item"><i class="fab fa-git"></i><p>https://gitee.com/XiaoFengQWQ</p></div>
                <div class="contact-item"><i class="fab fa-qq"></i><p>1432777209</p></div>
            </div>
        </div>
        <footer>©2026 小枫_QWQ | https://blog.xiaofengqwq.com</footer>
    `
];

/* =======================
   渲染逻辑
======================= */
function updateStatus() {
    if (state.subProject) {
        dom.status.textContent = projects[state.subProject].title;
    } else {
        const map = ["01 INTRO", "02 PROJECTS", "03 CONTACT"];
        dom.status.textContent = map[state.pageIndex];
    }
}
function render() {
    dom.left.classList.toggle(
        "spread",
        state.pageIndex !== 0 || state.subProject
    );

    dom.left.innerHTML = pages[state.pageIndex]();
    revealText(dom.left);
    updateStatus();
}

/* =======================
   页面切换
======================= */
async function go(next) {
    if (state.locked || state.subProject) return;
    if (next < 0) next = pages.length - 1;
    if (next >= pages.length) next = 0;
    if (next === state.pageIndex) return;

    state.locked = true;
    await smoothTo(dom.left, 0, -60, 1, 0);
    state.pageIndex = next;
    render();
    await smoothTo(dom.left, 60, 0, 0, 1);
    state.locked = false;
}

/* =======================
   项目详情
======================= */
async function openProject(id) {
    if (state.locked) return;
    state.locked = true;
    state.subProject = id;

    await smoothTo(dom.left, 0, -60, 1, 0);

    dom.left.innerHTML = `
        <div class="section">
            <h2>${projects[id].title}</h2>
            <p>${projects[id].desc}</p>
            <div class="back-hint">← 返回项目列表</div>
        </div>
    `;

    dom.projectImage.style.backgroundImage = `url('${projects[id].image}')`;
    dom.projectImage.classList.add("active");

    revealText(dom.left);
    updateStatus();

    await smoothTo(dom.left, 60, 0, 0, 1);
    state.locked = false;
}
function backToProjects() {
    if (state.locked || !state.subProject) return;
    state.subProject = null;
    dom.projectImage.classList.remove("active");
    render();
}

/* ========================
   事件（统一委托）
======================= */
dom.left.addEventListener("click", e => {
    const project = e.target.closest(".projects li");
    if (project) openProject(project.dataset.id);

    const back = e.target.closest(".back-hint");
    if (back) backToProjects();

    const contact = e.target.closest(".contact-item");
    if (contact) {
        navigator.clipboard.writeText(contact.innerText);
    }
});

// 触摸事件
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener("touchstart", e => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", e => {
    if (!state.portrait.shown) {
        touchEndY = e.changedTouches[0].clientY;
        const diff = touchEndY - touchStartY;
        // 向下滑动是下一页，向上滑动是上一页
        if (Math.abs(diff) > 30) { // 避免误触
            go(diff > 0 ? state.pageIndex - 1 : state.pageIndex + 1);
        }
    }
}, { passive: true });

// 保留鼠标滚轮支持
window.addEventListener("wheel", e => {
    if (!state.portrait.shown) {
        go(e.deltaY > 0 ? state.pageIndex + 1 : state.pageIndex - 1);
    }
}, { passive: true });

window.addEventListener("keydown", e => {
    if (state.portrait.shown) return;
    if (e.key === "Escape") backToProjects();
    if (["ArrowDown", "ArrowRight"].includes(e.key)) go(state.pageIndex + 1);
    if (["ArrowUp", "ArrowLeft"].includes(e.key)) go(state.pageIndex - 1);
});

/* =======================
   Canvas 背景
======================= */
const ctx = dom.canvas.getContext("2d");
let w, h, mouse = { x: 0, y: 0 }, running = true;

function resize() {
    w = dom.canvas.width = dom.canvas.clientWidth = dom.canvas.parentElement.clientWidth;
    h = dom.canvas.height = dom.canvas.clientHeight = dom.canvas.parentElement.clientHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
});

const dots = Array.from({ length: 60 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4
}));

function draw() {
    if (!running) return requestAnimationFrame(draw);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#6aa6ff";
    dots.forEach(d => {
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
            d.vx -= dx / dist * 0.02;
            d.vy -= dy / dist * 0.02;
        }
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.globalAlpha = .6;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(draw);
}
draw();

/* =======================
   初始化
======================= */
render();
