// 使用 Fetch API 获取 INDEX.JSON 文件内容
fetch('/1.0/res/projects.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // 解析 JSON 数据
    })
    .then(data => {
        const filesElement = document.getElementById('files');

        // 遍历每个项目，并创建对应的 li 元素
        data.forEach(item => {
            // 创建 li 元素
            const listItem = document.createElement('li');

            // 创建 a 元素并设置属性
            const link = document.createElement('a');
            link.href = item.path;
            link.className = 'icon icon-directory';
            link.title = item.name;

            // 创建 name 元素并设置内容
            const nameSpan = document.createElement('span');
            nameSpan.className = 'name';
            nameSpan.textContent = item.name;

            // 创建 size 元素
            const sizeSpan = document.createElement('span');
            sizeSpan.className = 'size';
            sizeSpan.textContent = '';

            // 创建 date 元素并设置内容
            const dateSpan = document.createElement('span');
            dateSpan.className = 'date';
            dateSpan.textContent = '2024/6/23 09:52:21';

            // 将 name、size 和 date 添加到 a 元素中
            link.appendChild(nameSpan);
            link.appendChild(sizeSpan);
            link.appendChild(dateSpan);

            // 将 a 元素添加到 li 元素中
            listItem.appendChild(link);

            // 将 li 元素添加到 id 为 files 的元素中
            filesElement.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("Error loading JSON data: ", error);
    });

function $(id) {
    var el = 'string' == typeof id
        ? document.getElementById(id)
        : id;

    el.on = function (event, fn) {
        if ('content loaded' == event) {
            event = window.attachEvent ? "load" : "DOMContentLoaded";
        }
        el.addEventListener
            ? el.addEventListener(event, fn, false)
            : el.attachEvent("on" + event, fn);
    };

    el.all = function (selector) {
        return $(el.querySelectorAll(selector));
    };

    el.each = function (fn) {
        for (var i = 0, len = el.length; i < len; ++i) {
            fn($(el[i]), i);
        }
    };

    el.getClasses = function () {
        return this.getAttribute('class').split(/\s+/);
    };

    el.addClass = function (name) {
        var classes = this.getAttribute('class');
        el.setAttribute('class', classes
            ? classes + ' ' + name
            : name);
    };

    el.removeClass = function (name) {
        var classes = this.getClasses().filter(function (curr) {
            return curr != name;
        });
        this.setAttribute('class', classes.join(' '));
    };

    return el;
}

function search() {
    var str = $('search').value.toLowerCase();
    var links = $('files').all('a');

    links.each(function (link) {
        var text = link.textContent.toLowerCase();

        if ('..' == text) return;
        if (str.length && ~text.indexOf(str)) {
            link.addClass('highlight');
        } else {
            link.removeClass('highlight');
        }
    });
}

$(window).on('content loaded', function () {
    $('search').on('keyup', search);
});