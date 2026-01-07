# Развёртывание (Deployment)

## Сборка приложения

### Команда сборки

```bash
npm run build
```

Процесс сборки:

1. **TypeScript компиляция** — проверка типов (`tsc -b`)
2. **Vite build** — оптимизация и бандлинг

Результат в директории `dist/`.

### Содержимое dist/

```
dist/
├── index.html              # Точка входа
├── assets/
│   ├── index-[hash].js     # JS бандл (~456 KB, ~146 KB gzip)
│   ├── index-[hash].css    # Стили (~56 KB, ~9 KB gzip)
│   └── Onest-*.ttf         # Шрифты (~64 KB каждый)
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
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
```

**Важно:** Все переменные должны начинаться с `VITE_`.

## Варианты хостинга

### Vercel (рекомендуется)

1. Подключите GitHub репозиторий
2. Vercel автоматически определит Vite проект
3. Настройки по умолчанию работают из коробки

**vercel.json** (для SPA routing):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Переменные окружения** в панели Vercel:

- `VITE_API_URL` = URL вашего бэкенда

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

3. Добавьте в vite.config.ts:

```typescript
export default defineConfig({
  base: '/repo-name/',
  // ...
});
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
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Сборка и запуск:**

```bash
docker build -t portfolio-frontend .
docker run -p 80:80 portfolio-frontend
```

## Оптимизация

### Анализ бандла

```bash
npm run build -- --analyze
```

### Текущие метрики

| Файл   | Размер  | Gzip    |
| ------ | ------- | ------- |
| JS     | ~456 KB | ~146 KB |
| CSS    | ~56 KB  | ~9 KB   |
| Шрифты | ~580 KB | -       |

### Рекомендации

1. **Code Splitting** — уже реализовано через React Router lazy loading
2. **Шрифты** — рассмотрите woff2 формат для меньшего размера
3. **Images** — используйте WebP/AVIF форматы
4. **Caching** — настройте долгий cache для assets

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

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Мониторинг

### Рекомендуемые сервисы

- **Sentry** — отслеживание ошибок
- **Vercel Analytics** — производительность
- **Google Analytics** — статистика посещений

### Интеграция Sentry

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

## Чеклист перед деплоем

- [ ] Все тесты проходят
- [ ] `npm run lint` без ошибок
- [ ] `npm run build` успешен
- [ ] Переменные окружения настроены
- [ ] CORS на бэкенде разрешает production домен
- [ ] SSL сертификат настроен
- [ ] Редиректы для SPA настроены
