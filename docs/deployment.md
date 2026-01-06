# Развёртывание (Deployment)

## Сборка приложения

### Команда сборки

```bash
npm run build
```

Процесс сборки:

1. **TypeScript компиляция** — проверка типов (`tsc -b`)
2. **Vite build** — оптимизация и бандлинг ассетов

Результат находится в директории `dist/`.

### Содержимое dist/

```
dist/
├── index.html          # Точка входа
├── assets/
│   ├── index-[hash].js # Основной JS бандл
│   ├── index-[hash].css # Стили
│   └── fonts/          # Шрифты
└── favicon.ico
```

## Переменные окружения

### Для сборки

Создайте файл `.env.production`:

```env
VITE_API_URL=https://api.your-domain.com
VITE_GITHUB_USERNAME=your-username
```

### Использование в коде

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Важно:** Все переменные должны начинаться с `VITE_`.

## Варианты хостинга

### Vercel (рекомендуется)

1. Подключите GitHub репозиторий
2. Vercel автоматически определит Vite проект
3. Настройки по умолчанию работают из коробки

**vercel.json** (опционально):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify

1. Подключите репозиторий
2. Build command: `npm run build`
3. Publish directory: `dist`

**Создайте `public/_redirects`:**

```
/* /index.html 200
```

### GitHub Pages

1. Установите gh-pages:

```bash
npm install -D gh-pages
```

2. Добавьте в package.json:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "homepage": "https://username.github.io/repo-name"
}
```

3. В vite.config.ts добавьте base:

```typescript
export default defineConfig({
  base: '/repo-name/',
  // ...
});
```

4. Деплой:

```bash
npm run deploy
```

### Nginx (VPS/Dedicated)

1. Скопируйте содержимое `dist/` на сервер
2. Настройте Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/portfolio/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статики
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### Docker

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Сборка и запуск:**

```bash
docker build -t portfolio-frontend .
docker run -p 80:80 portfolio-frontend
```

## CI/CD

### GitHub Actions

**.github/workflows/deploy.yml:**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Чеклист перед деплоем

- [ ] Переменные окружения настроены для продакшена
- [ ] API URL указывает на продакшен-сервер
- [ ] CORS на бэкенде настроен для домена фронтенда
- [ ] Сборка проходит без ошибок (`npm run build`)
- [ ] Линтер не выдаёт критических ошибок
- [ ] Тестирование основных сценариев (login, register, order)
- [ ] Проверка мобильной версии
- [ ] SSL сертификат настроен (HTTPS)

## Мониторинг

### Рекомендуемые инструменты

- **Sentry** — отслеживание ошибок
- **Google Analytics** — аналитика посещений
- **Lighthouse** — аудит производительности

### Установка Sentry (опционально)

```bash
npm install @sentry/react
```

```typescript
// main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```
