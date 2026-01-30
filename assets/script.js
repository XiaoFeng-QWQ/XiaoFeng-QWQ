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

(function () {
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
        </div>`,
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
        <footer>©2026 小枫_QWQ | https://blog.xiaofengqwq.com</footer>`
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
        </div>`;

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

    /* ========================
       Canvas 背景系统
    ======================= */
    const ctx = dom.canvas.getContext("2d");
    let w, h, mouse = { x: 0, y: 0 }, running = true;
    let time = 0;

    function resize() {
        w = dom.canvas.width = dom.canvas.parentElement.clientWidth;
        h = dom.canvas.height = dom.canvas.parentElement.clientHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // 鼠标/触摸交互
    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX - dom.canvas.getBoundingClientRect().left;
        mouse.y = e.clientY - dom.canvas.getBoundingClientRect().top;
    });

    window.addEventListener("touchmove", e => {
        if (e.touches.length > 0) {
            const rect = dom.canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
        }
    });

    document.addEventListener("visibilitychange", () => {
        running = !document.hidden;
    });

    // 粒子系统
    class Particle {
        constructor() {
            this.reset();
            this.x = Math.random() * w;
            this.y = Math.random() * h;
        }

        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.color = `hsla(${190 + Math.random() * 40}, 70%, 65%, ${0.4 + Math.random() * 0.3})`;
            this.orbitRadius = Math.random() * 50 + 20;
            this.orbitSpeed = (Math.random() - 0.5) * 0.02;
            this.orbitAngle = Math.random() * Math.PI * 2;
        }

        update() {
            // 鼠标引力
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.speedX += (dx / distance) * force * 0.1;
                this.speedY += (dy / distance) * force * 0.1;
            }

            // 轨道运动
            this.orbitAngle += this.orbitSpeed;
            this.x += Math.cos(this.orbitAngle) * 0.2;
            this.y += Math.sin(this.orbitAngle) * 0.2;

            // 边界碰撞
            if (this.x < 0 || this.x > w) this.speedX *= -0.8;
            if (this.y < 0 || this.y > h) this.speedY *= -0.8;

            // 限制位置
            this.x = Math.max(0, Math.min(w, this.x));
            this.y = Math.max(0, Math.min(h, this.y));

            // 应用速度
            this.x += this.speedX;
            this.y += this.speedY;

            // 减速
            this.speedX *= 0.98;
            this.speedY *= 0.98;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // 绘制发光效果
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace('0.4', '0.15');
            ctx.fill();
        }
    }

    // 连接线
    function drawConnections(particles) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const opacity = 1 - (distance / 100);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(106, 166, 255, ${opacity * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // 创建粒子
    const particles = Array.from({ length: 80 }, () => new Particle());

    // 动画循环
    function animate() {
        if (!running) {
            requestAnimationFrame(animate);
            return;
        }

        time += 0.01;

        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#0b0c10');
        gradient.addColorStop(0.5, '#0e0e18');
        gradient.addColorStop(1, '#0b0c10');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // 绘制中心光环
        const centerX = w / 2;
        const centerY = h / 2;
        const radius = 100 + Math.sin(time * 0.5) * 20;

        // 光环渐变
        const haloGradient = ctx.createRadialGradient(
            centerX, centerY, radius * 0.3,
            centerX, centerY, radius
        );
        haloGradient.addColorStop(0, 'rgba(106, 166, 255, 0.1)');
        haloGradient.addColorStop(1, 'rgba(106, 166, 255, 0)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = haloGradient;
        ctx.fill();

        // 更新和绘制粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 绘制连接线
        drawConnections(particles);

        // 绘制鼠标交互光环
        const mouseRadius = 60 + Math.sin(time * 2) * 10;
        const mouseGradient = ctx.createRadialGradient(
            mouse.x, mouse.y, 0,
            mouse.x, mouse.y, mouseRadius
        );
        mouseGradient.addColorStop(0, 'rgba(106, 166, 255, 0.3)');
        mouseGradient.addColorStop(1, 'rgba(106, 166, 255, 0)');

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2);
        ctx.fillStyle = mouseGradient;
        ctx.fill();

        requestAnimationFrame(animate);
    }

    // 初始化动画
    animate();

    // 添加粒子重置功能（防止粒子聚集）
    setInterval(() => {
        particles.forEach(particle => {
            if (Math.random() < 0.01) {
                particle.reset();
            }
        });
    }, 1000);

    /* =======================
       初始化
    ======================= */
    render();
})()