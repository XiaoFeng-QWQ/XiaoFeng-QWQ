/* ===== Motion Config ===== */
const MOTION = {
    duration: 420,
    ease(t) {
        return t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
};

let pageIndex = 0;
let subProject = null;
let locked = false;

// DOM 元素
const left = document.getElementById("left");
const visual = document.getElementById("visual");
const canvas = document.getElementById("heroCanvas");
const projectImage = document.getElementById("projectImage");
const statusElement = document.getElementById("status");
const portraitWarning = document.getElementById("portraitWarning");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const continueBtn = document.getElementById("continueBtn");

// 竖屏检测标志
let isPortraitWarningShown = false;
let userIgnoredWarning = false;

/* ===== 竖屏检测和全屏功能 ===== */

// 检测是否为竖屏
function isPortrait() {
    return window.innerHeight > window.innerWidth && window.innerWidth < 768;
}

// 检测是否为移动设备
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 显示竖屏警告
function showPortraitWarning() {
    if (isMobile() && isPortrait() && !userIgnoredWarning) {
        portraitWarning.classList.add('active');
        isPortraitWarningShown = true;
    }
}

// 隐藏竖屏警告
function hidePortraitWarning() {
    portraitWarning.classList.remove('active');
}

// 全屏功能
function requestFullscreen() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }

    // 强制横屏（在支持屏幕旋转的设备上）
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {
            console.log('屏幕旋转锁定失败');
        });
    }
}

// 退出全屏
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

// 检测全屏状态
function isFullscreen() {
    return !!(document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement);
}

// 全屏事件监听
document.addEventListener('fullscreenchange', checkOrientation);
document.addEventListener('webkitfullscreenchange', checkOrientation);
document.addEventListener('mozfullscreenchange', checkOrientation);
document.addEventListener('MSFullscreenChange', checkOrientation);

// 窗口大小改变时检查方向
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// 检查方向函数
function checkOrientation() {
    if (isMobile() && isPortrait() && !userIgnoredWarning) {
        showPortraitWarning();
    } else {
        hidePortraitWarning();
    }
}

// 全屏按钮点击事件
fullscreenBtn.addEventListener('click', () => {
    requestFullscreen();
    hidePortraitWarning();
    userIgnoredWarning = true;
});

// 继续浏览按钮点击事件
continueBtn.addEventListener('click', () => {
    hidePortraitWarning();
    userIgnoredWarning = true;
});

// 初始化时检查方向
checkOrientation();

/* ===== 原有功能 ===== */
const projects = {
    mc: {
        title: "WS实现视频转MC指令 #py #mc",
        desc: "一个使用websocket来实现在MC 基岩版内播放任意视频的py脚本。<br>开源地址：https://gitee.com/XiaoFengQWQ/mc-websocket-player",
        image: "https://s41.ax1x.com/2026/01/10/pZ0GMjJ.png"
    },
    xqfchat: {
        title: "XQFChatRoom #php #chat",
        desc: "基于 PHP 的简易聊天室，支持多用户在线聊天。",
        image: "https://s41.ax1x.com/2026/01/10/pZ0G28S.png"
    },
    XQFWebMusicPlayer: {
        title: "XQFWebMusicPlayer #js #music",
        desc: "一个集成了APlayer(音乐播放器) + 自定义设置的前端音乐播放器",
        image: "https://s21.ax1x.com/2025/07/20/pV8nm9K.png"
    }
};

const pages = [
    {
        render: () => `
          <div class="hero-title avatar-section">
            <img class="avatar-img" src="https://q.qlogo.cn/headimg_dl?dst_uin=1432777209&spec=640">
            <h1>你好，我是小枫_QWQ</h1>
          </div>
          <div class="hero-desc">
            <p>业余网页开发者，专注于前端与后端开发。</p>
            <p>熟悉 HTML, CSS, JavaScript，PHP</p>
          </div>`
    },
    {
        render: () => `
          <div class="section">
            <h2>项目</h2>
            <ul class="projects">
              <li data-id="mc">WS实现视频转MC指令 #py #mc</li>
              <li data-id="xqfchat">XQFChatRoom #php #chat</li>
              <li data-id="XQFWebMusicPlayer">XQFWebMusicPlayer #js #music</li>
            </ul>
            <p>更多请<a href="https://gitee.com/XiaoFengQWQ" target="_blank">查看我的 Gitee</a></p>
            <p>查看旧的前端项目：<a href="/1.0/projects/index.html" target="_blank">点击查看旧的</a></p>
          </div>
          <footer>©2026 小枫_QWQ</footer>`
    },
    {
        render: () => `
          <div class="section">
            <h2>联系方式</h2>
            <div class="contact-list">
              <div class="contact-item">
                <i class="fas fa-envelope contact-icon"></i>
                <div>
                  <h3>邮箱</h3>
                  <p>1432777209@qq.com</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fab fa-github contact-icon"></i>
                <div>
                  <h3>GitHub</h3>
                  <p>https://github.com/XiaoFeng-QWQ</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fab fa-qq contact-icon"></i>
                <div>
                  <h3>QQ</h3>
                  <p>1432777209</p>
                </div>
              </div>
            </div>
          </div>
          <footer>©2026 小枫_QWQ</footer>`
    }
];

function smoothTo(el, fromX, toX, fromO, toO, cb) {
    let start = null;
    function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / MOTION.duration, 1);
        const e = MOTION.ease(p);
        el.style.transform = `translateX(${fromX + (toX - fromX) * e}px)`;
        el.style.opacity = fromO + (toO - fromO) * e;
        p < 1 ? requestAnimationFrame(step) : cb && cb();
    }
    requestAnimationFrame(step);
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

function updateStatus() {
    if (subProject) {
        statusElement.innerHTML = `<span>${projects[subProject].title}</span>`;
    } else {
        const statusMap = {
            0: '<span>01</span><span>INTRO</span>',
            1: '<span>02</span><span>PROJECTS</span>',
            2: '<span>03</span><span>CONTACT</span>'
        };
        statusElement.innerHTML = statusMap[pageIndex] || statusMap[0];
    }
}

function fadeVisual(text) {
    visual.style.opacity = 0;
    setTimeout(() => {
        visual.textContent = text;
        visual.style.opacity = 1;
    }, 120);
}

function showProjectImage(url) {
    projectImage.classList.remove("active");
    setTimeout(() => {
        projectImage.style.backgroundImage = `url('${url}')`;
        projectImage.classList.add("active");
    }, 200);
}

function bindBackHint() {
    const backHint = document.querySelector('.back-hint');
    if (backHint) {
        backHint.style.cursor = 'pointer';
        backHint.onclick = () => {
            if (!locked && subProject) {
                backToProjects();
            }
        };
    }
}

function renderProjectDetail(id) {
    left.innerHTML = `
        <div class="section">
          <h2>${projects[id].title}</h2>
          <p>${projects[id].desc}</p>
          <div class="back-hint">← 点击返回项目列表</div>
        </div>`;
    fadeVisual(projects[id].title);
    showProjectImage(projects[id].image);
    revealText(left);
    updateStatus();
    bindBackHint();
}

function bindProjects() {
    document.querySelectorAll(".projects li").forEach(li => {
        li.onclick = () => {
            if (locked) return;
            locked = true;
            subProject = li.dataset.id;
            smoothTo(left, 0, -60, 1, 0, () => {
                renderProjectDetail(subProject);
                smoothTo(left, 60, 0, 0, 1, () => locked = false);
            });
        };
    });
}

// 绑定联系方式项目的点击事件
function bindContactItems() {
    document.querySelectorAll(".contact-item").forEach(item => {
        item.onclick = () => {
            const text = item.querySelector("p").textContent;
            navigator.clipboard.writeText(text).then(() => {
                // 显示复制成功的反馈
                const originalText = item.querySelector("h3").textContent;
                item.querySelector("h3").textContent = "已复制!";
                item.style.background = "rgba(106, 166, 255, 0.15)";

                setTimeout(() => {
                    item.querySelector("h3").textContent = originalText;
                    item.style.background = "";
                }, 1500);
            }).catch(err => {
                console.error('复制失败:', err);
                // 如果复制失败，可以显示一个提示
                const originalText = item.querySelector("h3").textContent;
                item.querySelector("h3").textContent = "复制失败";

                setTimeout(() => {
                    item.querySelector("h3").textContent = originalText;
                }, 1500);
            });
        };
    });
}

function render() {
    left.innerHTML = pages[pageIndex].render();
    canvas.style.opacity = pageIndex === 0 ? 1 : 0.25;
    if (pageIndex === 1) bindProjects();
    if (pageIndex === 2) bindContactItems();
    revealText(left);
    updateStatus();
}

function go(i) {
    if (locked || subProject) return;

    // 确保索引在有效范围内
    if (i < 0) i = pages.length - 1;
    if (i >= pages.length) i = 0;

    // 如果已经在该页面，不执行任何操作
    if (pageIndex === i) return;

    locked = true;
    smoothTo(left, 0, -60, 1, 0, () => {
        pageIndex = i;
        render();
        smoothTo(left, 60, 0, 0, 1, () => locked = false);
    });
}

// 返回项目列表的函数
function backToProjects() {
    if (locked || !subProject) return;
    subProject = null;
    projectImage.classList.remove("active");
    render();
}

// 事件监听 - 添加竖屏检测条件
window.addEventListener("wheel", e => {
    if (!isPortraitWarningShown) {
        if (e.deltaY > 0) {
            go(pageIndex + 1); // 向下滚动到下一页
        } else {
            go(pageIndex - 1); // 向上滚动到上一页
        }
    }
}, { passive: true });

window.addEventListener("keydown", e => {
    if (isPortraitWarningShown) return;

    if (e.key === "Escape" && subProject) {
        backToProjects();
    }
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        go(pageIndex + 1); // 下一个页面
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        go(pageIndex - 1); // 上一个页面
    }
});

/* ===== Canvas ===== */
const ctx = canvas.getContext("2d");
let w, h, mouse = { x: 0, y: 0 };
function resize() {
    w = canvas.width = canvas.clientWidth = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.clientHeight = canvas.parentElement.clientHeight;
}
window.onresize = resize;
resize();

window.onmousemove = e => mouse = { x: e.clientX, y: e.clientY };

const dots = [...Array(60)].map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4
}));

function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#6aa6ff";
    dots.forEach(d => {
        const dx = mouse.x - d.x, dy = mouse.y - d.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
            d.vx -= dx / dist * 0.02;
            d.vy -= dy / dist * 0.02;
        }
        d.x += d.vx; d.y += d.vy;
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

// 初始化渲染
render();