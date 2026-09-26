@echo off
title Tanya Tani - Server Lokal
echo ==================================================
echo    MENJALANKAN TANYA TANI (DEV SERVER)
echo ==================================================
echo.
set "PATH=C:\Users\Rahmad Saputra\AppData\Local\nodejs-portable\node-v22.16.0-win-x64;%PATH%"

echo Membuka server di http://localhost:3000 ...
call npm run dev
pause
