/**
 * 声明全局变量来存储图像对象
 */
var image;

/**
 * 计算调整后的图像尺寸
 * @param {HTMLImageElement} image - 图像对象
 * @returns {Object} - 调整后的宽高对象
 */
function calculateDimensions(image) {
    const maxWidth = $("input[name='maxWidth']").val();
    const maxHeight = $("input[name='maxHeight']").val();
    let width = image.width;
    let height = image.height;
    // 根据图像的宽高比调整尺寸，确保不超过最大宽高
    if (width > height) {
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
    }
    return { width, height };
}

/**
 * 图像压缩
 */
function imageCompression() {
    const fileInput = $('#fileInput')[0]; // 直接获取文件输入元素
    const file = fileInput.files[0];
    if (!file) return;
    console.table(file);

    const reader = new FileReader();
    reader.onload = function (readerEvent) {
        image = new Image();
        image.onload = function () {
            const canvas = $('#canvas')[0];
            const ctx = canvas.getContext('2d');

            const { width, height } = calculateDimensions(image);
            canvas.width = width;
            canvas.height = height;

            // 在画布上绘制图像
            ctx.drawImage(image, 0, 0, width, height);
            // 更新预览
            updatePreview();
        };
        image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * 更新预览
 */
function updatePreview() {
    const canvas = $('#canvas')[0];
    const ctx = canvas.getContext('2d');
    const compressionLevel = parseFloat($('#compressionLevel').val());
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 检查图像是否存在
    if (!image || !image.complete) return;

    // 在画布上绘制图像
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // 获取压缩后的图像并显示在预览框中
    const compressedImage = $('#compressedImage');
    compressedImage.attr('src', canvas.toDataURL('image/jpeg', compressionLevel));
    compressedImage.css('display', 'block');
    console.debug(`Compression Level: ${compressionLevel}`);

    // 启用下载按钮
    $('#downloadButton').prop('disabled', false);

    return 'Update Preview Done'
}

// 文件输入框变化时执行图像压缩
$('#fileInput').on('change', imageCompression);

// 当点击自定义文件按钮时，触发原始文件选择按钮的点击事件
$('#customFileBtn').click(function () {
    $('#fileInput').click();
});

// 当文件选择发生变化时，更新显示文件名的段落内容
$('#fileInput').change(function () {
    var fileName = $(this).val().split('\\').pop(); // 获取文件名
    $('#fileName').text('Selected file: ' + fileName); // 将文件名显示在段落中
});

// 当压缩级别滑块的值发生变化时，更新预览
$('#compressionLevel').on('input', function () {
    updatePreview();
});

// 当最大宽度输入框的值发生变化时，更新预览
$("input[name='maxWidth']").on('change', function () {
    imageCompression();
    updatePreview();
});

// 当最大高度输入框的值发生变化时，更新预览
$("input[name='maxHeight']").on('change', function () {
    imageCompression();
    updatePreview();
});

// 点击下载按钮时执行以下操作
$('#downloadButton').on('click', function () {
    const compressedImage = $('#compressedImage')[0];
    const fileName = 'compressed_' + $('#fileName').text(); // 使用选择的文件名
    const downloadLink = $('<a>').attr('href', compressedImage.src).attr('download', fileName);
    downloadLink[0].click();
});

// 点击清除按钮时执行以下操作
$('#clearButton').on('click', function () {
    // 清空文件输入框的值
    $('#fileInput').val('');
    const canvas = $('#canvas')[0];
    const ctx = canvas.getContext('2d');
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 隐藏压缩后的图像预览
    $('#compressedImage').attr('src', '').css('display', 'none');
    // 禁用下载按钮
    $('#downloadButton').prop('disabled', true);
    // 清空文件名显示
    $('#fileName').text('');
});