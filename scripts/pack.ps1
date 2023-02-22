$root = "."
$buildFolder = "$root\build"
$buildBin = "$root\build\bin"
$buildBinDist = "$root\build\bin\dist"
$buildZip = "$root\build\zip"

npm i
npx webpack --mode=production --config webpack.config.js

if (!(Test-Path $buildFolder -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildFolder
}
if (!(Test-Path $buildBin -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildBin
}
if (!(Test-Path $buildBinDist -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildBinDist
}
if (!(Test-Path $buildZip -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildZip
}
copy-item -path "$root\index.html", "$root\style.css" -destination "$root\build\bin" -force
copy-item -path "$root\dist\*" -destination "$buildBinDist" -force
$compress = @{
   Path = "$buildBin\*"
   DestinationPath = "$buildZip\game.zip"
}
Compress-Archive @compress -Update