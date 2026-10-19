$ErrorActionPreference = 'Stop'

$photoDirectory = Join-Path $PSScriptRoot '..\assets\img\photos'
$outputPath = Join-Path $PSScriptRoot '..\assets\data\local-photos.js'
$slots = @(
  Get-ChildItem -LiteralPath $photoDirectory -Filter '*.jpg' -File |
    ForEach-Object { $_.BaseName } |
    Sort-Object -Unique
)

$entries = foreach ($slot in $slots) {
  '  ' + (ConvertTo-Json -InputObject $slot -Compress)
}
$content = "window.LOCAL_PHOTOS = [`r`n$($entries -join ",`r`n")`r`n];`r`n"
$encoding = New-Object System.Text.UTF8Encoding -ArgumentList $false
[System.IO.File]::WriteAllText($outputPath, $content, $encoding)
Write-Output "Updated $outputPath with $($slots.Count) local photo slot(s)."
