/**
 * 获取歌单列表并输出到页面
 * @returns 
 */
function getPlayList() {
    const playListID = document.getElementById("playListID").value.trim()
    const progress = document.getElementById("progress")
    if (playListID === "") {
        log("warning", `请输入歌单ID | by ${arguments.callee.name} function`)
        return
    }

    const API_URL = `https://api.music.dfggmc.top/?server=netease&type=playlist&id=${playListID}`
    log("info", `开始获取ID为 ${playListID} 的歌单 | by ${arguments.callee.name} function`)

    progress.style.display = "block"

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {

            const playListTableBody = document.querySelector("#playList tbody")
            playListTableBody.innerHTML = ""

            let songID = 1

            // 创建一个文档片段，防止页面卡顿
            const fragment = document.createDocumentFragment()

            data.forEach(song => {
                const songName = song.name
                const songArtist = song.artist
                const songUrl = song.url
                const songImage = song.pic
                const songLrc = song.lrc

                log("info", `获取音乐: ${song.name} - ${song.artist} | by ${arguments.callee.name} function`)

                // 创建 tr 并设置属性
                const tr = document.createElement("tr")
                tr.setAttribute("data-song-id", songID)
                tr.setAttribute("data-song-name", songName)
                tr.setAttribute("data-song-artist", songArtist)
                tr.setAttribute("data-song-url", songUrl)
                tr.setAttribute("data-song-lrc", songLrc)

                // 创建 td
                const tdID = document.createElement("td")
                tdID.textContent = songID
                tr.appendChild(tdID)

                const tdImage = document.createElement("td")
                const img = document.createElement("img")
                img.src = songImage
                img.width = 34
                img.height = 34
                tdImage.appendChild(img)
                tr.appendChild(tdImage)

                const tdName = document.createElement("td")
                tdName.textContent = songName
                tr.appendChild(tdName)

                const tdArtist = document.createElement("td")
                tdArtist.textContent = songArtist
                tr.appendChild(tdArtist)

                // 将 tr 添加到文档片段中
                fragment.appendChild(tr)

                songID++
            })

            // 将文档片段一次性添加到实际的 DOM 中
            playListTableBody.appendChild(fragment)
            mdui.updateTables()

            log("info", `获取歌单 ${playListID} 成功，一共 ${songID - 1} 首 | by ${arguments.callee.name} function`)
            progress.style.display = "none"
        })
        .catch(error => {
            log("warning", `获取歌单 ${playListID} 失败: ${error} | by ${arguments.callee.name} function`)
            progress.style.display = "none"
        })
}

/**
 * 清空歌单列表
 */
function clearPlayList() {
    const playListTableBody = document.querySelector("#playList tbody")
    playListTableBody.innerHTML = ""
}