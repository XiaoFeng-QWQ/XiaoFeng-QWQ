let warningCount = 0
let infoCount = 0
const logOutput = document.getElementById("logOutput")
logOutput.textContent = ""


/**
 * 日志输出函数
 * @param {string} type - 警告或信息类型，只允许传入 "warning" 或 "info"。
 * @param {*} message - 警告或信息的内容。
 */
function log(type, message) {
    const logLine = document.createElement("div")
    const hr = document.createElement("div")

    switch (type) {
        case "warning":
            warningCount++
            logLine.textContent = `[warning] ${message}`
            document.querySelector("#warningCount").textContent = warningCount
            logLine.classList.add("warning")
            break
        case "info":
        default:
            infoCount++
            logLine.textContent = `[info] ${message}`
            document.querySelector("#infoCount").textContent = infoCount
            logLine.classList.add("info")
            break
    }

    logOutput.appendChild(logLine)
    logOutput.appendChild(hr)
    hr.classList.add("mdui-divider")

    logOutput.scrollTop = logOutput.scrollHeight
}


/**
 * 停止日志输出
 */
function stopLogOutput() {
    logOutput.innerHTML = ""
}

/**
 * 清空日志
 */
function clearLogs() {
    logOutput.innerHTML = ""
    warningCount = 0
    infoCount = 0
    document.querySelector("#warningCount").textContent = warningCount
    document.querySelector("#infoCount").textContent = infoCount
}