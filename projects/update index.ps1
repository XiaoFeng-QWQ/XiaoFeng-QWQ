#这是一个用于生成项目索引的powershell脚本

$output = @()

Get-ChildItem -Directory | ForEach-Object {
    $folderName = $_.Name
    $folderPath = "/projects/$folderName/index.html"
    $folderInfo = @{
        "name" = $folderName
        "path" = $folderPath
    }
    $output += $folderInfo
}

$outputJson = $output | ConvertTo-Json
$outputPath = "..\res\projects.json"

# 使用 System.Text.UTF8Encoding 创建带 BOM 的 UTF8 编码
$utf8BomEncoding = New-Object System.Text.UTF8Encoding $true

# 将输出内容写入文件
[System.IO.File]::WriteAllText($outputPath, $outputJson, $utf8BomEncoding)

Write-Host "输出已保存到: $outputPath"