# Builds the BuiltByBit downloads in dist/:
#   OZ-Theme-v<ver>.zip            base theme (no add-on files)
#   OZ-Addon-RankPreview-v<ver>.zip, OZ-Addon-SalesPack-v<ver>.zip, OZ-Addon-PagesPack-v<ver>.zip
# Usage: powershell -File tools/package.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$ver = (Get-Content package.json -Raw | ConvertFrom-Json).version
Add-Type -AssemblyName System.IO.Compression.FileSystem
New-Item -ItemType Directory -Force dist | Out-Null

$addons = @{
  'RankPreview' = @{ Name = 'Rank Preview'; Twig = @('oz-addon-ranks.twig', 'oz-preview.twig', 'oz-addon-ranks-js.twig'); Js = @('oz-preview.js');
    Info = "Adds a live 3D skin preview with the rank's nametag, chat and tab-list preview, a rank ladder, a 'your current rank' picker and the rank comparison table.`r`nSettings to fill in: Rank category, Rank comparison rows (rank-table), Rank styles." }
  'SalesPack'   = @{ Name = 'Sales Pack'; Twig = @('oz-addon-sales.twig'); Js = @();
    Info = "Adds the homepage sale banner with live countdown, a one-time discount pop-up with your coupon code, and a currency picker in the basket.`r`nSettings to fill in: Sale banner (sale-*), Discount pop-up (promo-*), Currencies." }
  'PagesPack'   = @{ Name = 'Pages Pack'; Twig = @('oz-addon-pages.twig'); Js = @();
    Info = "Adds styled Staff, Vote, FAQ, Patrons, Rules and News pages.`r`nCreate a Tebex page titled Staff, Vote, FAQ, Patrons, Rules or News, then fill the matching list setting (staff-list, vote-list, ...)." }
}
$addonFiles = $addons.Values | ForEach-Object { $_.Twig + $_.Js }

function Add-File($zip, $path, $entry) { [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, (Resolve-Path $path).Path, $entry) }
function New-Zip($name) { $p = Join-Path $root "dist\$name"; if (Test-Path $p) { Remove-Item $p }; return [System.IO.Compression.ZipFile]::Open($p, 'Create') }

# Base theme
$z = New-Zip "OZ-Theme-v$ver.zip"
foreach ($d in 'templates', 'assets', 'docs') {
  Get-ChildItem $d -Recurse -File | Where-Object { $addonFiles -notcontains $_.Name } | ForEach-Object {
    Add-File $z $_.FullName ('OZ-Theme/' + $_.FullName.Substring($root.Length + 1).Replace('\', '/'))
  }
}
foreach ($f in 'schema.json', 'README.md', 'CHANGELOG.md') { Add-File $z $f "OZ-Theme/$f" }
$z.Dispose()
Write-Output "dist/OZ-Theme-v$ver.zip"

# Add-ons
foreach ($key in $addons.Keys) {
  $a = $addons[$key]
  $z = New-Zip "OZ-Addon-$key-v$ver.zip"
  foreach ($t in $a.Twig) { Add-File $z "templates\$t" "OZ-$key/$t" }
  foreach ($j in $a.Js) { Add-File $z "assets\$j" "OZ-$key/$j" }
  $steps = "OZ $($a.Name) add-on (needs the OZ theme)`r`n`r`n$($a.Info)`r`n`r`nInstall:`r`n1. Tebex panel > Templates > OZ > Edit.`r`n2. Click + > Upload and add each .twig file here as a Twig asset" +
    $(if ($a.Js.Count) { ", and each .js file as a JavaScript asset" } else { "" }) +
    ".`r`n3. Save, then Publish. The feature turns on by itself; no page edits needed.`r`n4. Fill in the settings listed above (they are marked [$($a.Name) add-on] in the theme settings).`r`n"
  $e = $z.CreateEntry("OZ-$key/INSTALL.txt"); $w = New-Object System.IO.StreamWriter($e.Open()); $w.Write($steps); $w.Dispose()
  $z.Dispose()
  Write-Output "dist/OZ-Addon-$key-v$ver.zip"
}
