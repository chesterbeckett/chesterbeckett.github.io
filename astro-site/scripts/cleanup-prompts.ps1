$blogDir = "src\content\blog"

Get-ChildItem $blogDir -Filter *.md | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $originalContent = $content

    # Remove Jekyll prompt markers
    $content = $content -replace '\r?\n\{:\s*\.prompt-tip\s*\}', ''
    $content = $content -replace '\r?\n\{:\s*\.prompt-info\s*\}', ''
    $content = $content -replace '\r?\n\{:\s*\.prompt-warning\s*\}', ''

    # Only write if content changed
    if ($content -ne $originalContent) {
        $content | Out-File -FilePath $_.FullName -Encoding UTF8 -NoNewline
        Write-Host "✓ Cleaned: $($_.Name)"
    }
}

Write-Host "`n✓ Cleanup complete!"
