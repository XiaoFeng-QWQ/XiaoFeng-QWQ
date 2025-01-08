function getHitokoto() {
    fetch('https://v1.hitokoto.cn')
        .then(response => response.json())
        .then(data => {
            const hitokoto = document.querySelector('#hitokoto_text');
            hitokoto.innerText = `${data.hitokoto} - ${data.from}`;
            hitokoto.classList.add('typing');
        })
}

// 初次调用一次
getHitokoto();