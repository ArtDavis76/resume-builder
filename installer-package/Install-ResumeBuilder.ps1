$ErrorActionPreference = "Stop"

$appName = "Resume Builder"
$installRoot = Join-Path $env:LOCALAPPDATA "ResumeBuilder"
$sourceRoot = Join-Path $PSScriptRoot "app"
$desktop = [Environment]::GetFolderPath("Desktop")
if ([string]::IsNullOrWhiteSpace($desktop)) {
  $desktop = Join-Path $env:USERPROFILE "Desktop"
}
$shortcutPath = Join-Path $desktop "$appName.lnk"
$launcherPath = Join-Path $installRoot "Open Resume Builder.cmd"
$indexPath = Join-Path $installRoot "index.html"

if (-not (Test-Path -LiteralPath $sourceRoot)) {
  throw "Installer is missing the app folder. Keep this installer script next to the 'app' folder."
}

if (Test-Path -LiteralPath $installRoot) {
  Remove-Item -LiteralPath $installRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $installRoot | Out-Null
Get-ChildItem -LiteralPath $sourceRoot -Force | Copy-Item -Destination $installRoot -Recurse -Force

$launcher = @"
@echo off
start "" "%~dp0index.html"
"@
Set-Content -LiteralPath $launcherPath -Value $launcher -Encoding ASCII

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $launcherPath
$shortcut.WorkingDirectory = $installRoot
$shortcut.Description = "Open Resume Builder"
$shortcut.Save()

Write-Host ""
Write-Host "$appName installed successfully." -ForegroundColor Green
Write-Host "Installed to: $installRoot"
Write-Host "Desktop shortcut: $shortcutPath"
Write-Host ""
Write-Host "Opening the app..."
Start-Process -FilePath $indexPath
