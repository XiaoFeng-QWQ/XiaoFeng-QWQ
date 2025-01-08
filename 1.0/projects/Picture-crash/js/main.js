const fileInput = document.getElementById('fileInput');
const base64Result = document.getElementById('base64Result');
const imageContainer = document.getElementById('imageContainer');
const settingsContainer = document.getElementById('corruptImageSettings');

/**
 * 图片转换为Base64
 */
function convertToBase64() {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Data = e.target.result;
            base64Result.value = base64Data;
            displayImage(base64Data);
        };
        reader.readAsDataURL(file);
    } else {
        alert('请选择要转换的图片！');
    }
}

/**
 * 显示图片
 * @param {string} base64Data - 图片的Base64数据
 */
function displayImage(base64Data) {
    const img = document.createElement('img');
    img.src = base64Data;
    clearImageContainer();
    imageContainer.appendChild(img);
}

/**
 * 清空图片容器
 */
function clearImageContainer() {
    imageContainer.innerHTML = '';
}

/**
 * 图片崩坏
 */
function corruptImage() {
    const img = imageContainer.querySelector('img');
    if (img) {
        let base64Data = img.src.split(',')[1];
        const numModifications = parseInt(settingsContainer.querySelector('#numModifications').value);
        const offsetValue = parseInt(settingsContainer.querySelector('#offset').value);
        const dataLength = base64Data.length;
        let corruptedBase64Data = base64Data.split('');

        // 创建一个未被修改的位置索引数组
        let availableIndices = Array.from({ length: dataLength }, (_, index) => index);

        for (let i = 0; i < numModifications && availableIndices.length > 0; i++) {
            let randomIndex = Math.floor(Math.random() * availableIndices.length);
            let modifyIndex = availableIndices.splice(randomIndex, 1)[0]; // 随机选择一个索引并从数组中移除

            // 计算随机字符的偏移量
            const offset = Math.floor(Math.random() * offsetValue);
            // 获取当前位置的字符编码，然后加上偏移量
            const charCode = corruptedBase64Data[modifyIndex].charCodeAt(0) + offset;
            corruptedBase64Data[modifyIndex] = String.fromCharCode(charCode % 256); // 使用模256确保字符编码的有效性
        }

        // 生成并显示损坏的图片
        const mimeType = img.src.split(';')[0].split(':')[1];
        const corruptedImgSrc = `data:${mimeType};base64,${corruptedBase64Data.join('')}`;
        displayImage(corruptedImgSrc);
        base64Result.value = corruptedImgSrc;
    } else {
        alert('请先选择图片并转换为Base64！');
    }
}