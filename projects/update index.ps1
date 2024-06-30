#����һ������������Ŀ������powershell�ű�

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
$outputJson | Out-File -FilePath $outputPath

Write-Host "����ѱ��浽: $outputPath"