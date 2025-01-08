function main() {
    const playListID = document.getElementById("playListID").value.trim()
    if (playListID === "") {
        log("warning", `请输入歌单ID | by ${arguments.callee.name} function`)
        return
    }

    const API_URL = `https://api.music.dfggmc.top/?server=netease&type=playlist&id=${playListID}` //api地址

    fetch(API_URL)
        .then(response => response.json())
        .then(playlist => {
            const songs = playlist.map(song => ({
                name: song.name,
                artist: song.artist,
                url: song.url,
                pic: song.pic,
                lrc: song.lrc
            }))

            const downloadPromises = songs.map(song => {
                const mp3FileName = `${song.name} - ${song.artist}.mp3`
                const lrcFileName = `${song.name} - ${song.artist}.lrc`

                // 保存音频
                const mp3DownloadPromise = fetch(song.url)
                    .then(response => response.blob())
                    .then(blob => {
                        const mp3File = new File([blob], mp3FileName, { type: blob.type })
                        log("info", `保存文件 ${mp3File} | by ${arguments.callee.name} function`)
                        return saveFile(mp3File)
                    })

                // 保存歌词
                const lrcDownloadPromise = fetch(song.lrc)
                    .then(response => response.blob())
                    .then(blob => {
                        const lrcFile = new File([blob], lrcFileName, { type: blob.type })
                        log("info", `保存文件 ${lrcFile} | by ${arguments.callee.name} function`)
                        return saveFile(lrcFile)
                    })

                return Promise.all([mp3DownloadPromise, lrcDownloadPromise])
            })

            Promise.all(downloadPromises)
                .then(() => {
                    log("info", `文件下载完成 | by ${arguments.callee.name} function`)
                    packFiles()
                })
                .catch(error => {
                    log("warning", `文件下载错误：${error} | by ${arguments.callee.name} function`)
                })
        })
        .catch(error => {
            log("warning", `获取 JSON 数据失败：${error} | by ${arguments.callee.name} function`)
        })
}