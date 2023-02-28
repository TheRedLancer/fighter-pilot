#!/bin/bash
rootFolder=$1

if [ "$rootFolder" == "" ]; then
   echo "ERROR: Please provide a path to the folder containing \"index.html\""
   exit 1
fi
cd $rootFolder
buildFolder="$rootFolder/build"
buildDist="$rootFolder/build/dist"

npm i
npx webpack --mode=production --config webpack.config.js

if [ ! -d $buildFolder ]; then
    mkdir $buildFolder
fi
if [ ! -d "$buildDist" ]; then
    mkdir $buildDist
fi
cp ./index.html $buildFolder
cp ./style.css $buildFolder
cp -r ./dist/* $buildDist