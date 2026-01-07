# Руководство по установке и запуску

## Предварительные требования

### Обязательно

- **Node.js** версии 18 или выше
- **npm** (идёт в комплекте с Node.js)

### Для полного функционала

- **Backend API** — сервер на порту 4000
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
VITE_API_URL=http://localhost:4000
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

Результат сборки в папке `dist/`.

### Предварительный просмотр сборки

```bash
npm run preview
```

## Скрипты

| Команда           | Описание                          |
| ----------------- | --------------------------------- |
| `npm run dev`     | Запуск dev-сервера с HMR          |
| `npm run build`   | TypeScript проверка + Vite сборка |
| `npm run preview` | Просмотр собранного приложения    |
| `npm run lint`    | Проверка кода ESLint              |

## Работа с бэкендом

Фронтенд ожидает API на `http://localhost:4000`.

### API Endpoints

#### Авторизация

| Метод | Endpoint         | Описание         | Ответ                          |
| ----- | ---------------- | ---------------- | ------------------------------ |
| POST  | `/auth/register` | Регистрация      | `{ user, token, permissions }` |
| POST  | `/auth/login`    | Вход             | `{ user, token, permissions }` |
| POST  | `/auth/logout`   | Выход            | `{ message }`                  |
| GET   | `/auth/profile`  | Получить профиль | `{ user, permissions }`        |
| PUT   | `/auth/profile`  | Обновить профиль | `{ user, permissions }`        |

#### Проекты

| Метод | Endpoint        | Описание        | Доступ          |
| ----- | --------------- | --------------- | --------------- |
| GET   | `/projects`     | Список проектов | Auth            |
| GET   | `/projects/:id` | Получить проект | Auth            |
| POST  | `/projects`     | Создать проект  | Auth            |
| PATCH | `/projects/:id` | Обновить проект | Admin/Moderator |

#### Отзывы

| Метод  | Endpoint       | Описание       | Доступ      |
| ------ | -------------- | -------------- | ----------- |
| GET    | `/reviews`     | Список отзывов | Public      |
| GET    | `/reviews/:id` | Получить отзыв | Public      |
| POST   | `/reviews`     | Создать отзыв  | Auth        |
| PUT    | `/reviews/:id` | Обновить отзыв | Owner       |
| DELETE | `/reviews/:id` | Удалить отзыв  | Owner/Admin |

#### Контакты

| Метод | Endpoint   | Описание            | Доступ |
| ----- | ---------- | ------------------- | ------ |
| POST  | `/contact` | Отправить сообщение | Public |

#### Админ

| Метод | Endpoint          | Описание         | Доступ |
| ----- | ----------------- | ---------------- | ------ |
| GET   | `/admin/stats`    | Статистика       | Admin  |
| GET   | `/admin/users`    | Все пользователи | Admin  |
| GET   | `/admin/projects` | Все проекты      | Admin  |
| GET   | `/admin/reviews`  | Все отзывы       | Admin  |

## Структура MobX Stores

### Использование в компонентах

```tsx
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores';

const MyComponent = observer(() => {
  // Автоматически перерендерится при изменении store
  return <div>{authStore.user?.firstName}</div>;
});
```

### Вызов actions

```tsx
// Логин
const handleLogin = async () => {
  const success = await authStore.loginUser({ email, password });
  if (success) navigate('/');
};

// Загрузка данных
useEffect(() => {
  reviewsStore.loadReviews();
}, []);
```

## Переменные окружения

| Переменная             | Описание        | По умолчанию            |
| ---------------------- | --------------- | ----------------------- |
| `VITE_API_URL`         | URL бэкенд API  | `http://localhost:4000` |
| `VITE_GITHUB_USERNAME` | GitHub username | -                       |

**Важно:** Все переменные должны начинаться с `VITE_`.

## Частые проблемы

### CORS ошибки

Убедитесь, что бэкенд разрешает запросы с `http://localhost:5173`:

```typescript
// На бэкенде
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
```

### 401 Unauthorized

- Проверьте, что токен сохраняется в localStorage
- Проверьте, что бэкенд запущен и доступен

### Стили не применяются

- Убедитесь, что CSS файл импортирован в компонент
- Проверьте имена классов на соответствие BEM
