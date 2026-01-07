# Архитектура и Структура проекта

## Структура директорий

```
portfolio-website-frontend/
├── docs/                   # Документация проекта
├── public/                 # Статические файлы
├── src/
│   ├── assets/             # Статические ресурсы
│   │   └── fonts/          # Шрифты (Onest)
│   ├── components/         # Переиспользуемые UI компоненты
│   │   ├── CookieConsent/  # Баннер согласия с Cookie
│   │   ├── Form/           # Компоненты форм
│   │   ├── Layout/         # Основной макет страниц
│   │   ├── LoadingSpinner/ # Индикатор загрузки
│   │   ├── Navbar/         # Навигационная панель
│   │   ├── StarRating/     # Компонент рейтинга
│   │   └── StatusBadge/    # Бейдж статуса проекта
│   ├── constants/          # Константы приложения
│   │   └── index.ts        # Опции для селектов
│   ├── stores/             # MobX stores
│   │   ├── api.ts          # Настроенный axios instance
│   │   ├── index.ts        # Реэкспорт stores
│   │   ├── AuthStore.ts    # Store авторизации
│   │   ├── ReviewsStore.ts # Store отзывов
│   │   ├── ProjectsStore.ts# Store проектов
│   │   ├── AdminStore.ts   # Store админ-панели
│   │   ├── GitHubStore.ts  # Store GitHub данных
│   │   ├── ContactStore.ts # Store контактной формы
│   │   └── CookieConsentStore.ts # Store cookie consent
│   ├── hooks/              # Кастомные хуки
│   │   └── index.ts        # useForm, useApi
│   ├── pages/              # Компоненты страниц
│   │   ├── Admin/          # Админ-панель
│   │   ├── Contacts/       # Страница контактов
│   │   ├── Home/           # Главная страница
│   │   ├── Login/          # Страница входа
│   │   ├── Order/          # Страница заказа
│   │   ├── PrivacyPolicy/  # Политика конфиденциальности
│   │   ├── Profile/        # Личный кабинет
│   │   ├── Register/       # Страница регистрации
│   │   ├── ReviewDetail/   # Детальный просмотр отзыва
│   │   └── Reviews/        # Список отзывов
│   ├── types/              # TypeScript типы
│   │   └── index.ts        # Все интерфейсы
│   ├── App.tsx             # Корневой компонент с роутингом
│   ├── App.css             # Глобальные стили приложения
│   ├── main.tsx            # Точка входа
│   └── index.css           # Дизайн-система (CSS Variables)
├── eslint.config.js        # Конфигурация ESLint
├── tsconfig.json           # Конфигурация TypeScript
├── vite.config.ts          # Конфигурация Vite
└── package.json            # Зависимости и скрипты
```

## MobX Architecture

### Stores

Все stores находятся в `src/stores/` и экспортируются через `index.ts`:

```typescript
// src/stores/index.ts
export { authStore } from './AuthStore';
export { reviewsStore } from './ReviewsStore';
export { projectsStore } from './ProjectsStore';
export { adminStore } from './AdminStore';
export { githubStore } from './GitHubStore';
export { contactStore } from './ContactStore';
export { cookieConsentStore } from './CookieConsentStore';
```

### AuthStore

Центральный store для аутентификации:

```typescript
class AuthStore {
  user: User | null = null;
  permissions: string[] = [];
  isLoading = true;
  error: string | null = null;

  // Computed
  get isAuthenticated(): boolean;
  get isAdmin(): boolean;
  get isModerator(): boolean;

  // Actions
  loginUser(data: LoginData): Promise<boolean>;
  registerUser(data: RegisterData): Promise<boolean>;
  logout(): void;
  updateProfile(data: ProfileData): Promise<boolean>;
  checkAuth(): Promise<void>;
  refreshUser(): Promise<void>;
}
```

### API Layer

Все API вызовы интегрированы в stores. Axios instance настроен в `stores/api.ts`:

```typescript
// src/stores/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});

// Request interceptor - добавляет JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - обрабатывает 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Компоненты

### Layout

Обёртка для всех страниц:

- Содержит `Navbar`, основной контент (`Outlet`) и `Footer`
- Управляет отображением `CookieConsent`

```tsx
const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Outlet />
      </main>
      <footer className="layout__footer">{/* Footer content */}</footer>
      <CookieConsent />
    </div>
  );
};
```

### Navbar

Навигационная панель с адаптивным дизайном:

- **Desktop:** Горизонтальное меню + профильный dropdown
- **Mobile:** Drawer-меню с анимацией
- Обёрнут в `observer` для реактивности с MobX

### Использование MobX в компонентах

```tsx
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores';

const MyComponent: React.FC = observer(() => {
  // Компонент автоматически перерендерится при изменении authStore
  if (authStore.isLoading) return <LoadingSpinner />;

  return (
    <div>
      {authStore.isAuthenticated ? (
        <p>Привет, {authStore.user?.firstName}!</p>
      ) : (
        <Link to="/login">Войти</Link>
      )}
    </div>
  );
});
```

## CSS Architecture

### Дизайн-система (index.css)

Централизованные CSS переменные:

```css
:root {
  /* Colors */
  --color-primary: #0f172a;
  --color-accent: #6366f1;
  --color-bg: #f8fafc;
  --color-text: #0f172a;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
}
```

### BEM Naming

Все классы следуют BEM методологии:

```css
/* Block */
.card {
}

/* Element */
.card__title {
}
.card__content {
}

/* Modifier */
.card--hover {
}
.card--glass {
}
```

### Breakpoints

```css
/* Tablet */
@media (max-width: 768px) {
}

/* Mobile */
@media (max-width: 480px) {
}
```

## Routing

Маршрутизация через React Router v7:

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="contacts" element={<Contacts />} />
    <Route path="reviews" element={<Reviews />} />
    <Route path="reviews/:id" element={<ReviewDetail />} />
    <Route path="order" element={<Order />} />
    <Route path="profile" element={<Profile />} />
    <Route path="admin" element={<AdminPanel />} />
    <Route path="privacy" element={<PrivacyPolicy />} />
  </Route>
  <Route path="login" element={<Login />} />
  <Route path="register" element={<Register />} />
</Routes>
```

## TypeScript Types

Все типы в `src/types/index.ts`:

```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  telegram?: string;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
}

interface Review {
  id: number;
  title: string;
  body: string;
  rating: number;
  userId: number;
  user?: User;
  createdAt: string;
}

interface Project {
  id: number;
  clientName: string;
  type: ProjectType;
  status: ProjectStatus;
  description: string;
  telegram: string;
  createdAt: string;
}

type ProjectType = 'landing' | 'ecommerce' | 'webapp' | 'bot' | 'other';
type ProjectStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
```
