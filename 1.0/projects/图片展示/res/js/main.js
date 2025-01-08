const infoElement = document.querySelector('.info');
const tipsElement = document.querySelector('.controls');
let imageURL = ''; // 在全局范围内定义imageURL变量并赋初值

/**
 * 保存图片
 */
function saveImage() {
    if (!imageURL) {
        infoElement.textContent = `没有可保存的图片！`;
        return;
    }
    infoElement.textContent = `开始请求下载...`;
    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = 'downloaded_image.png'; // 保存文件名
    document.body.appendChild(downloadLink);
    downloadLink.click(); // 触发下载链接的点击事件
    downloadLink.remove(); // 从文档中移除链接
    // 注意：不要释放 imageURL，因为它是基于 URL.createObjectURL(blob) 创建的
}

/**
 * 请求图片
 */
async function fetchImage() {
    infoElement.textContent = `获取中，请稍后...`;
    try {
        const response = await fetch("https://t.alcy.cc/pc/");
        if (!response.ok) {
            throw new Error(`HTTP 错误！状态码: ${response.status}`);
        }
        const blob = await response.blob();
        imageURL = URL.createObjectURL(blob);
        document.body.style.backgroundImage = `url('${imageURL}')`;
        infoElement.textContent = `获取图片成功! URL: ${imageURL}`;
    } catch (error) {
        console.error(`发生错误: ${error}`);
        infoElement.textContent = `发生错误: ${error} 请刷新重试`;
    }
}

/**
 * 切换全屏模式
 */
function fullScreenElement() {
    if (document.fullscreenElement) {
        exitFullScreen();
    } else {
        enterFullScreen();
    }
}

/**
 * 启动全屏模式
 */
function enterFullScreen() {
    infoElement.style.display = 'none';
    tipsElement.style.display = 'none';
    document.documentElement.requestFullscreen();
}

/**
 * 退出全屏模式
 */
function exitFullScreen() {
    infoElement.style.display = 'block';
    tipsElement.style.display = 'block';
    document.exitFullscreen();
}

document.addEventListener('fullscreenchange', handleFullscreenChange);

/**
 * 处理全屏模式变化
 */
function handleFullscreenChange() {
    if (document.fullscreenElement) {
        infoElement.style.display = 'none';
        tipsElement.style.display = 'none';
    } else {
        infoElement.style.display = 'block';
        tipsElement.style.display = 'block';
    }
}

// 初次加载图片
fetchImage();