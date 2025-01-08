#����һ������������Ŀ������powershell�ű�

$output = @()

Get-ChildItem -Directory | ForEach-Object {
    $folderName = $_.Name
    $folderPath = "$folderName/index.html"
    $folderInfo = @{
        "name" = $folderName
        "path" = "/1.0" + $folderPath
    }
    $output += $folderInfo
}

$outputJson = $output | ConvertTo-Json
$outputPath = "projects.json"

# ʹ�� System.Text.UTF8Encoding ������ BOM �� UTF8 ����
$utf8BomEncoding = New-Object System.Text.UTF8Encoding $true

# ���������д���ļ�
[System.IO.File]::WriteAllText($outputPath, $outputJson, $utf8BomEncoding)

Write-Host "����ѱ��浽: $outputPath"