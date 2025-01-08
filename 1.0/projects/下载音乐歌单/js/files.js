/**
 * 保存文件
 * @param {*} file 
 * @returns 
 */
function saveFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const base64Data = event.target.result.split(",")[1];
            const blob = b64toBlob(base64Data, file.type);

            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = file.name;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            resolve();
        };
        reader.onerror = error => {
            reject(error);
        };
    });

    /**
     * base64 转 Blob 对象
     * @param {*} base64Data 
     * @param {*} contentType 
     * @returns 
     */
    function b64toBlob(base64Data, contentType) {
        contentType = contentType || "";
        const sliceSize = 1024;
        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }
}

/**
 * 压缩打包文件
 * @returns 
 */
function packFiles() {
    const playListID = document.getElementById("playListID").value.trim();
    if (!playListID) {
        alert("请输入歌单 ID");
        return;
    }

    const fileList = [
        { type: "mp3", selector: 'img[src$=".mp3"]' },
        { type: "lrc", selector: 'img[src$=".lrc"]' }
    ];

    const zip = new JSZip();

    let fileID = 1;

    Promise.all(
        fileList.map(({ type, selector }) => {
            const fileURLs = Array.from(document.querySelectorAll(`#playList tbody tr td:nth-child(2) ${selector}`));
            if (fileURLs.length === 0) {
                return Promise.resolve();
            }

            const promises = fileURLs.map(url => {
                const filename = `${fileID}.${type}`;
                fileID++;

                return fetch(url.src)
                    .then(response => response.blob())
                    .then(blob => {
                        zip.file(filename, blob);
                        log("info", `已添加 ${filename}`);
                    })
                    .catch(error => {
                        log("warning", `获取文件 ${filename} 失败：${error.message}`);
                    });
            });

            return Promise.all(promises);
        })
    )
        .then(() => {
            const zipFilename = `歌单${playListID}.zip`;
            zip.generateAsync({ type: "blob" }).then(content => {
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(content);
                downloadLink.download = zipFilename;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
        })
        .catch(error => {
            console.error("打包文件时出错：", error);
        });
}