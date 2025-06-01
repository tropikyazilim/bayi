# Bayi Yönetim Sistemi

Bu proje, bayi yönetim sisteminin backend ve frontend bileşenlerini içerir.

## Proje Yapısı

- `b/`: Backend (Node.js + Express + PostgreSQL)
- `f/`: Frontend (React + Vite)

## Kurulum

### Gereksinimler

- Node.js (v16+)
- PostgreSQL
- PM2 (Production deployment için)

### Backend Kurulum

```bash
cd b/
cp .env.example .env.development
# .env.development dosyasını düzenleyin
npm install
```

### Frontend Kurulum

```bash
cd f/
cp .env.example .env.development
# .env.development dosyasını düzenleyin
npm install
```

## Geliştirme

### Backend Geliştirme

```bash
# Windows
cd b/
npm run dev

# Linux/Mac
cd b/
npm run dev:linux
```

### Frontend Geliştirme

```bash
cd f/
npm run dev
```

## Production Deployment

### Manuel Deployment

```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### PM2 ile Deployment (Önerilen)

```bash
# PM2 kurulumu
npm install -g pm2

# Backend deployment
cd b/
pm2 start ecosystem.config.js

# Frontend build
cd f/
npm run build
```

## Ortam Değişkenleri

### Backend (.env.production)

- `NODE_ENV`: Çalışma ortamı (development/production)
- `PORT`: Sunucu portu
- `SITE_URL`: Site URL'i
- `DB_HOST`: Veritabanı sunucusu
- `DB_USER`: Veritabanı kullanıcı adı
- `DB_PASSWORD`: Veritabanı şifresi
- `DB_NAME`: Veritabanı adı
- `DB_PORT`: Veritabanı portu

### Frontend (.env.production)

- `VITE_MODE`: Çalışma ortamı
- `VITE_API_URL`: Backend API URL'i

## Lisans

Tüm hakları saklıdır.
