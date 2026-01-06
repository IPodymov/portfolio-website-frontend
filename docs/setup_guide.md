# Руководство по установке и запуску

## Предварительные требования

### Обязательно

- **Node.js** версии 18 или выше
- **npm** (обычно идёт в комплекте с Node.js)

### Для полного функционала

- **Backend API** — запущенный сервер на порту 4000
- **PostgreSQL** — база данных для бэкенда

## Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd portfolio-website-frontend
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка окружения (опционально)

Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:4000/api
VITE_GITHUB_USERNAME=your-github-username
```

## Запуск

### Режим разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

### Сборка для продакшена

```bash
npm run build
```

Результат сборки находится в папке `dist/`.

### Предварительный просмотр сборки

```bash
npm run preview
```

## Скрипты

| Команда           | Описание                       |
| ----------------- | ------------------------------ |
| `npm run dev`     | Запуск dev-сервера с HMR       |
| `npm run build`   | Сборка для продакшена          |
| `npm run preview` | Просмотр собранного приложения |
| `npm run lint`    | Проверка кода ESLint           |

## Работа с бэкендом

### Запуск бэкенда

Фронтенд ожидает API на `http://localhost:4000`. Убедитесь, что бэкенд запущен:

```bash
cd ../portfolio-website-backend
npm install
npm run dev
```

### API Endpoints

Приложение использует следующие эндпоинты:

- `POST /api/auth/login` — вход
- `POST /api/auth/register` — регистрация
- `GET /api/auth/profile` — профиль пользователя
- `GET/POST /api/projects` — проекты
- `GET/POST /api/reviews` — отзывы
- `GET /api/admin/stats` — статистика (admin)
- `GET /api/admin/users` — пользователи (admin)

## Устранение неполадок

### Ошибки TypeScript при сборке

**Проблема:** Ошибки с enum'ами
**Решение:** Проект использует `const` объекты вместо `enum` для совместимости с `erasableSyntaxOnly`:

```typescript
// Вместо: enum Status { PENDING = 'pending' }
// Используйте:
export const Status = { PENDING: 'pending' } as const;
export type Status = (typeof Status)[keyof typeof Status];
```

**Проблема:** `verbatimModuleSyntax` ошибки импортов
**Решение:** Разделяйте type и value импорты:

```typescript
// Неправильно:
import { User, UserRole } from './types';

// Правильно:
import type { User } from './types';
import { UserRole } from './types';
```

### Проблемы с зависимостями

```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS ошибки

Убедитесь, что бэкенд настроен на прием запросов с `http://localhost:5173`:

```typescript
// На бэкенде:
app.use(cors({ origin: 'http://localhost:5173' }));
```

### Приложение не видит API

1. Проверьте, что бэкенд запущен на порту 4000
2. Проверьте настройки в `src/api/axios.ts`
3. Откройте DevTools → Network и проверьте запросы

## Структура конфигурации

### vite.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
```

### tsconfig.json

Основные настройки TypeScript:

- `target`: ESNext
- `module`: ESNext
- `strict`: true
- `erasableSyntaxOnly`: true (требует const вместо enum)
