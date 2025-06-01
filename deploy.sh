#!/bin/bash
# filepath: d:\projeler\wolx\bayi\deploy.sh

echo "===== Bayi Yönetim Sistemi Deployment Script ====="
echo "$(date): Deployment başlatılıyor..."

# Backend deployment
echo "$(date): Backend derleniyor..."
cd b/
npm install
npm prune --production

# PM2 ile çalıştırma
if [ -x "$(command -v pm2)" ]; then
  echo "$(date): PM2 ile backend başlatılıyor..."
  pm2 delete bayi-backend 2>/dev/null || true
  pm2 start ecosystem.config.js
else
  echo "$(date): PM2 bulunamadı, lütfen yükleyin: npm install -g pm2"
  exit 1
fi

# Frontend deployment
echo "$(date): Frontend derleniyor..."
cd ../f/
npm install
npm run build

echo "$(date): Deployment tamamlandı!"
echo "===== Bayi Yönetim Sistemi Deployment Tamamlandı ====="
