# Generates MojoMind PWA PNG icons (flower mark on purple gradient)
Add-Type -AssemblyName System.Drawing

function New-MojoIcon {
  param([int]$Size, [string]$Path, [double]$Pad = 0.0, [bool]$Rounded = $true)

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  # Background gradient (rounded square or full bleed for maskable)
  $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect,
    ([System.Drawing.ColorTranslator]::FromHtml('#9036b8')),
    ([System.Drawing.ColorTranslator]::FromHtml('#4a1465')),
    ([System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)

  if ($Rounded) {
    $r = [int]($Size * 0.225)
    $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
    $gp.AddArc(0, 0, 2*$r, 2*$r, 180, 90)
    $gp.AddArc($Size - 2*$r, 0, 2*$r, 2*$r, 270, 90)
    $gp.AddArc($Size - 2*$r, $Size - 2*$r, 2*$r, 2*$r, 0, 90)
    $gp.AddArc(0, $Size - 2*$r, 2*$r, 2*$r, 90, 90)
    $gp.CloseFigure()
    $g.FillPath($brush, $gp)
  } else {
    $g.FillRectangle($brush, $rect)
  }

  # Flower: 6 white petals + warm core
  $cx = $Size / 2.0; $cy = $Size / 2.0
  $scale = ($Size / 64.0) * (1.0 - $Pad)
  $petalRx = 6.6 * $scale; $petalRy = 12.2 * $scale; $petalCy = -13.5 * $scale
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(247, 255, 255, 255))
  for ($k = 0; $k -lt 6; $k++) {
    $g.TranslateTransform($cx, $cy)
    $g.RotateTransform($k * 60)
    $g.FillEllipse($white, -$petalRx, ($petalCy - $petalRy), (2*$petalRx), (2*$petalRy))
    $g.ResetTransform()
  }
  $coreR = 6.9 * $scale
  $corePath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $corePath.AddEllipse($cx - $coreR, $cy - $coreR, 2*$coreR, 2*$coreR)
  $coreBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush $corePath
  $coreBrush.CenterColor = [System.Drawing.ColorTranslator]::FromHtml('#ffd166')
  $coreBrush.SurroundColors = @([System.Drawing.ColorTranslator]::FromHtml('#f3256b'))
  $g.FillPath($coreBrush, $corePath)

  $g.Dispose()
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Wrote $Path"
}

$out = Join-Path (Split-Path $PSScriptRoot -Parent) 'icons'
New-Item -ItemType Directory -Force -Path $out | Out-Null
New-MojoIcon -Size 192 -Path (Join-Path $out 'icon-192.png')
New-MojoIcon -Size 512 -Path (Join-Path $out 'icon-512.png')
New-MojoIcon -Size 512 -Path (Join-Path $out 'maskable-512.png') -Pad 0.22 -Rounded $false
New-MojoIcon -Size 180 -Path (Join-Path $out 'apple-touch-icon.png') -Rounded $false
