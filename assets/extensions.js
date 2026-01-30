/* ========================
   扩展功能集合
======================= */
(function () {
    // 项目图片灯箱
    function initLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="" alt="">
            <button class="lightbox-close"><i class="fas fa-times"></i></button>
        </div>`;
        document.body.appendChild(lightbox);

        document.addEventListener('click', (e) => {
            if (e.target.closest('.project-image') && state.subProject) {
                const imgUrl = projects[state.subProject].image;
                lightbox.querySelector('img').src = imgUrl;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            if (e.target.closest('.lightbox-close') || e.target.id === 'lightbox') {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 复制成功提示
    function showCopySuccess(text) {
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.innerHTML = `<i class="fas fa-check"></i> 已复制: ${text}`;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // 修改原有的复制功能
    function enhanceCopyFeature() {
        document.addEventListener('click', (e) => {
            const contact = e.target.closest('.contact-item');
            if (contact) {
                const text = contact.querySelector('p').textContent;
                navigator.clipboard.writeText(text).then(() => {
                    showCopySuccess(text);
                });
            }
        });
    }

    // 初始化所有扩展功能
    function initExtensions() {
        initLightbox();
        enhanceCopyFeature();
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initExtensions);
    } else {
        initExtensions();
    }
})();
