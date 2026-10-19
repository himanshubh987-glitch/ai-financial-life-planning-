param(
    [string]$ResDir
)

Add-Type -AssemblyName System.Drawing

$densities = @(
    @{ Folder = "mipmap-mdpi"; Size = 48; FontSize = 16 },
    @{ Folder = "mipmap-hdpi"; Size = 72; FontSize = 24 },
    @{ Folder = "mipmap-xhdpi"; Size = 96; FontSize = 32 },
    @{ Folder = "mipmap-xxhdpi"; Size = 144; FontSize = 48 },
    @{ Folder = "mipmap-xxxhdpi"; Size = 192; FontSize = 64 }
)

foreach ($d in $densities) {
    $dir = Join-Path $ResDir $d.Folder
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $size = $d.Size
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # Background dark emerald
    $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $brushBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 11, 15, 25))
    $g.FillRectangle($brushBg, $rect)

    # Outer emerald circle
    $margin1 = [int]($size * 0.125)
    $circleSize1 = $size - (2 * $margin1)
    $brushCircle = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
    $g.FillEllipse($brushCircle, $margin1, $margin1, $circleSize1, $circleSize1)

    # Inner core circle
    $margin2 = [int]($size * 0.1875)
    $circleSize2 = $size - (2 * $margin2)
    $brushCore = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 6, 78, 59))
    $g.FillEllipse($brushCore, $margin2, $margin2, $circleSize2, $circleSize2)

    # Letter 'L' in gold
    $fontSize = [float]$d.FontSize
    $font = [System.Drawing.Font]::new("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $brushText = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("L", $font, $brushText, (New-Object System.Drawing.RectangleF 0, 0, $size, $size), $format)

    $g.Dispose()
    $outPath = Join-Path $dir "ic_launcher.png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "Generated: $outPath ($size x $size)"
}
