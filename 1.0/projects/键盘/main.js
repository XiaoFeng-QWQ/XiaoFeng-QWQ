$(".keyboard__popup").draggable({
    containment: "document", // 限制在整个文档内拖动
    scroll: false, // 禁用滚动条滚动
    drag: function (event, ui) {
        // 限制元素不超出屏幕
        let containment = $(window); // 将窗口作为限制容器
        let leftPos = ui.position.left;
        let topPos = ui.position.top;

        if (leftPos < 0) { ui.position.left = 0; }
        if (topPos < 0) { ui.position.top = 0; }
        if (leftPos + $(this).width() > containment.width()) {
            ui.position.left = containment.width() - $(this).width();
        }
        if (topPos + $(this).height() > containment.height()) {
            ui.position.top = containment.height() - $(this).height();
        }
    }
});



$('.keyboard__popup-content').on('click', '.keyboard__key', function () {
    $(this).addClass('keyboard__key_marked_true');
    console.log($(this).val()); //获取HTML内容
    setTimeout(function () {
        $('.keyboard__key_marked_true').removeClass('keyboard__key_marked_true');
    }, 100);
});
