# Music-player 音乐播放器 <br> 一个集成了[APlayer(音乐播放器)](https://github.com/DIYgod/APlayer) + [MDUI(设置UI)](https://github.com/zdhxiong/mdui) + [jquery(网页DOM操作)](https://github.com/jquery/jquery)

## [演示地址](https://www.dfggmc.top/)

![效果图](/preview.png)
![效果图2](/preview%20(2).png)

## 如何使用？
```html

<!-- 任意元素加上 mdui-dialog="{target: '#music-player-settings'}" -->
<button class="mdui-btn mdui-color-theme-accent mdui-ripple" mdui-dialog="{target: '#music-player-settings'}">
    打开音乐播放器设置
</button>

<!-- 添加ID为 music-player-container 元素 -->
<div id="music-player-container"></div>

<!-- 引入 -->

<!-- 引入js -->
<script src="mian.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/mdui/1.0.2/js/mdui.min.js"></script>
<script src="https://cdn.staticfile.org/aplayer/1.10.1/APlayer.min.js"></script>
<script>
    // 新建类
    const musicPlayer = new MusicPlayerSettings();
    // 调用主函数
    musicPlayer.main();
</script>

<!-- 完成! -->
```

## 欢迎提交[issues](https://github.com/XiaoFeng-QWQ/music-player/issues)
