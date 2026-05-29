Write-Host "Cleaning Watchman cache..."
watchman watch-del-all

Write-Host "Removing node_modules..."
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
}

Write-Host "Removing package-lock.json..."
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
}

Write-Host "Cleaning Metro Bundler cache..."
if (Test-Path "$env:TMPDIR/metro-*") {
    Remove-Item -Recurse -Force "$env:TMPDIR/metro-*"
}
if (Test-Path "$env:TEMP/metro-*") {
    Remove-Item -Recurse -Force "$env:TEMP/metro-*"
}

Write-Host "Cleaning Gradle cache..."
cd android
./gradlew clean
cd ..

Write-Host "Reinstalling dependencies..."
npm install

Write-Host "Done! You can now start the app using 'npx expo start -c'"
