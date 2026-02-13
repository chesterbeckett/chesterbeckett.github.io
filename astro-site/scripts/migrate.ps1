$postsDir = "..\_posts"
$outputDir = "src\content\blog"

Get-ChildItem $postsDir -Filter *.md | ForEach-Object {
    $lines = Get-Content $_.FullName

    $inFrontMatter = $false
    $frontMatterLines = @()
    $bodyLines = @()
    $frontMatterCount = 0

    foreach ($line in $lines) {
        if ($line -eq '---') {
            $frontMatterCount++
            if ($frontMatterCount -eq 2) {
                $inFrontMatter = $false
            } else {
                $inFrontMatter = $true
            }
            continue
        }

        if ($inFrontMatter) {
            $frontMatterLines += $line
        } elseif ($frontMatterCount -ge 2) {
            $bodyLines += $line
        }
    }

    # Parse front matter
    $title = ""
    $date = ""
    $categories = ""
    $tags = ""

    foreach ($line in $frontMatterLines) {
        if ($line -match '^title:\s*(.+)$') {
            $title = $matches[1].Trim()
        }
        elseif ($line -match '^date:\s*(\d{4}-\d{2}-\d{2})') {
            $date = $matches[1]
        }
        elseif ($line -match '^categories:\s*\[(.+?)\]') {
            $categories = $matches[1]
        }
        elseif ($line -match '^tags:\s*\[(.+?)\]') {
            $tags = $matches[1] -replace '\s*#.*$', ''
        }
    }

    # Build new content
    $newContent = @"
---
title: $title
date: $date
categories: [$categories]
tags: [$tags]
---
$($bodyLines -join "`n")
"@

    $outputPath = Join-Path $outputDir $_.Name
    $newContent | Out-File -FilePath $outputPath -Encoding UTF8
    Write-Host "✓ $($_.Name)"
}

Write-Host "`n✓ Migration complete!"
