@echo off
REM filepath: d:\projeler\wolx\bayi\deploy.bat

echo ===== Bayi Yonetim Sistemi Deployment Script =====
echo %date% %time%: Deployment baslatiliyor...

REM Backend deployment
echo %date% %time%: Backend derleniyor...
cd b/
call npm install
call npm prune --production

REM PM2 ile calistirma
where pm2 >nul 2>nul
if %ERRORLEVEL% == 0 (
  echo %date% %time%: PM2 ile backend baslatiliyor...
  call pm2 delete bayi-backend 2>nul
  call pm2 start ecosystem.config.js
) else (
  echo %date% %time%: PM2 bulunamadi, lutfen yukleyin: npm install -g pm2
  exit /b 1
)

REM Frontend deployment
echo %date% %time%: Frontend derleniyor...
cd ../f/
call npm install
call npm run build

echo %date% %time%: Deployment tamamlandi!
echo ===== Bayi Yonetim Sistemi Deployment Tamamlandi =====
