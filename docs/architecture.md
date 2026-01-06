# Архитектура и Структура проекта

## Структура директорий

```
src/
├── api/                    # Модули для взаимодействия с API
│   ├── index.ts            # Реэкспорт всех API модулей
│   ├── axios.ts            # Настроенный экземпляр axios с интерсепторами
│   ├── admin.ts            # API админ-панели (статистика, управление)
│   ├── auth.ts             # API авторизации (login, register, profile)
│   ├── contact.ts          # API контактной формы
│   ├── github.ts           # API GitHub (профиль, репозитории)
│   ├── notifications.ts    # API уведомлений
│   ├── projects.ts         # API проектов (CRUD)
│   └── reviews.ts          # API отзывов (CRUD)
├── assets/                 # Статические ресурсы
│   └── fonts/              # Шрифты
├── components/             # Переиспользуемые UI компоненты
│   ├── CookieConsent/      # Баннер согласия с Cookie
│   ├── Form/               # Компоненты форм
│   │   ├── FormField.tsx   # Универсальный компонент поля формы
│   │   └── Form.css        # Стили форм
│   ├── Layout/             # Основной макет (Navbar, Footer)
│   ├── LoadingSpinner/     # Компонент загрузки
│   ├── Navbar/             # Навигационная панель
│   ├── StarRating/         # Компонент рейтинга звёздами
│   └── StatusBadge/        # Бейдж статуса проекта
├── context/                # React Context
│   └── AuthContext.tsx     # Контекст авторизации (user, login, logout)
├── hooks/                  # Кастомные хуки
│   ├── index.ts            # Реэкспорт хуков
│   ├── useApi.ts           # Хук для API-запросов (loading, error, execute)
│   └── useForm.ts          # Хук для работы с формами (values, handleChange)
├── pages/                  # Компоненты страниц
│   ├── Admin/              # Админ-панель (Dashboard, Users, Projects, Reviews)
│   ├── Contacts/           # Страница контактов
│   ├── Home/               # Главная страница
│   ├── Login/              # Страница входа
│   ├── Order/              # Страница заказа проекта
│   ├── PrivacyPolicy/      # Политика конфиденциальности
│   ├── Profile/            # Личный кабинет пользователя
│   ├── Register/           # Страница регистрации
│   ├── ReviewDetail/       # Детальный просмотр отзыва
│   └── Reviews/            # Список отзывов
├── types/                  # TypeScript типы
│   └── index.ts            # Все интерфейсы и константы типов
├── App.tsx                 # Корневой компонент с маршрутизацией
├── App.css                 # Глобальные стили приложения
├── main.tsx                # Точка входа
└── index.css               # CSS переменные и базовые стили
```

## Ключевые компоненты

### Layout

Обёртка для всех страниц приложения. Содержит `Navbar`, основной контент и `Footer`. Управляет отображением `CookieConsent`. Автоматически скрывает Footer на странице админ-панели.

### Navbar

Навигационная панель с адаптивным дизайном:

- **Desktop:** Горизонтальное меню с ссылками и профильным dropdown-меню.
- **Mobile:** Гамбургер-меню с Drawer (чистый CSS, без MUI).
- **Профильное меню:** Dropdown с иконками для Профиль, Админ панель (для админов), Выход.
- Использует `useLocation` для подсветки активного пункта меню.

### Form Components

Переиспользуемые компоненты для форм:

- **FormField:** Универсальный компонент поля с поддержкой input, textarea, select, hint.
- **useForm:** Хук для управления состоянием формы.

### AdminPanel

Полнофункциональная админ-панель:

- **Desktop:** Боковая навигация (sidebar) + основной контент.
- **Mobile:** Горизонтальные табы (pills) вверху страницы.
- **Dashboard:** Статистика, графики по статусам, последние записи.
- **CRUD-таблицы:** Пользователи, Проекты, Отзывы с возможностью редактирования.

### Utility Components

- **LoadingSpinner:** Индикатор загрузки с анимацией.
- **StarRating:** Интерактивный компонент рейтинга (1-5 звёзд).
- **StatusBadge:** Цветной бейдж для отображения статуса проекта.

## Взаимодействие с API

### Конфигурация Axios

```typescript
// src/api/axios.ts
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Интерсептор добавляет JWT-токен к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### API Модули

| Модуль     | Эндпоинты                                        | Описание         |
| ---------- | ------------------------------------------------ | ---------------- |
| `auth`     | `/auth/login`, `/auth/register`, `/auth/profile` | Авторизация      |
| `projects` | `/projects`                                      | CRUD проектов    |
| `reviews`  | `/reviews`                                       | CRUD отзывов     |
| `admin`    | `/admin/stats`, `/admin/users`, etc.             | Админ-функции    |
| `github`   | GitHub API                                       | Публичные данные |

### Кастомный хук useApi

```typescript
const { data, loading, error, execute } = useApi(apiFunction);
```

## Типизация

### Константы как объекты

Для совместимости с `erasableSyntaxOnly` используются `const` объекты вместо `enum`:

```typescript
export const ProjectStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
```

### Основные интерфейсы

- `User` — пользователь (id, email, firstName, lastName, telegram, role)
- `Project` — проект (id, clientName, type, status, description, etc.)
- `Review` — отзыв (id, body, rating, serviceQuality, author, etc.)
- `AdminStats` — статистика для Dashboard

## Стилизация

### CSS Variables

```css
:root {
  --color-primary: #1a1a2e;
  --color-accent: #4361ee;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-background: #f9fafb;
}
```

### Адаптивность

Основные точки перелома:

- **Desktop:** > 768px
- **Tablet:** 481px — 768px
- **Mobile:** ≤ 480px

```css
@media (max-width: 768px) {
  /* Планшеты */
}
@media (max-width: 480px) {
  /* Мобильные */
}
```

## Маршрутизация

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/contacts" element={<Contacts />} />
  <Route path="/reviews" element={<Reviews />} />
  <Route path="/reviews/:id" element={<ReviewDetail />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/order" element={<Order />} /> {/* Protected */}
  <Route path="/profile" element={<Profile />} /> {/* Protected */}
  <Route path="/admin" element={<AdminPanel />} /> {/* Admin only */}
  <Route path="/privacy" element={<PrivacyPolicy />} />
</Routes>
```
