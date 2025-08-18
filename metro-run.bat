@echo off
title React Native Metro & Android Runner
echo =========================================
echo   React Native Auto Metro + Emulator Run
echo =========================================

:: ----- CONFIG -----
:: Change this to your AVD name from Android Studio's Device Manager
set AVD_NAME=Pixel_6a

:: Change Metro port if not using default
set METRO_PORT=8081

echo Killing old Node/Java processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM java.exe >nul 2>&1

echo Starting Metro bundler on port %METRO_PORT%...
start cmd /k "npx react-native start --port=%METRO_PORT% --reset-cache"

echo Booting Android Emulator: %AVD_NAME%...
start cmd /k "%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd %AVD_NAME%"

:: Wait for emulator to boot
echo Waiting for device to connect...
:wait_for_device
for /f "skip=1 tokens=1" %%d in ('adb devices') do (
    if "%%d"=="device" goto device_ready
)
timeout /t 5 >nul
goto wait_for_device

:device_ready
echo Device connected!

echo Setting up ADB reverse on port %METRO_PORT%...
adb reverse tcp:%METRO_PORT% tcp:%METRO_PORT%

echo Running React Native app...
npx react-native run-android --port=%METRO_PORT%

echo All done! Press any key to exit...
pause >nul
