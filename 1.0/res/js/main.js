//加载组件
$("#header").load('/1.0/res/module/header.html');
$("#footer").load('/1.0/res/module/footer.html');

/**----------------------
 *   ---- 全站Pjax ----
 * ---------------------*/
// 监听所有具有 data-pjax-url 属性的 a 标签
$(document).on('click', 'a[data-pjax-url]:not(a[target="_blank"],a[no-pjax])', function (event) {
    var url = $(this).data('pjax-url'); // 获取 data-pjax-url 的值
    // 发起 PJAX 请求
    $.pjax({
        url: url,
        container: 'main',
        fragment: 'main',
        timeout: 20000
    });
});
$(document).on('pjax:send', function () {
    NProgress.start();
});
$(document).on('pjax:end', function () {
    showPageHtml();
    NProgress.done();
});


// 使用事件委托绑定点击事件
$(document).on('click', '.mdui-tab a', function (event) {
    event.preventDefault(); // 阻止默认点击行为

    // 移除所有 a 元素的 mdui-tab-active 类
    $('.mdui-tab a').removeClass('mdui-tab-active');
    // 为点击的 a 元素添加 mdui-tab-active 类
    $(this).addClass('mdui-tab-active');
});

fetch('https://v1.hitokoto.cn')
    .then(response => response.json())
    .then(data => {
        const hitokoto = document.querySelector('#hitokoto_text');
        hitokoto.href = `https://hitokoto.cn/?uuid=${data.uuid}`;
        hitokoto.innerText = data.hitokoto;
    })
    .catch(error => {
        $('#hitokoto_text').text(`一言获取失败: ${error}`);
    });