# Copilot instructions — portfolio-website-frontend

Краткое назначение

- Быстро встроиться в frontend-репозиторий на React + TypeScript + Vite, понять архитектуру и следовать существующим соглашениям при внесении изменений.

Ключевая архитектура (big picture)

- SPA на React + Vite с маршрутизацией в [src/App.tsx](src/App.tsx#L1).
- Состояние приложения управляется MobX-stores в [src/stores](src/stores) и реэкспортируется через [src/stores/index.ts](src/stores/index.ts#L1).
- UI-компоненты организованы по папкам в [src/components](src/components) и централизованно реэкспортируются в [src/components/index.ts](src/components/index.ts#L1).
- Документация по архитектуре в [docs/architecture.md](docs/architecture.md).

Запуск и workflow

- Установка: `npm install`.
- Локальная разработка: `npm run dev` (Vite).
- Сборка: `npm run build` (выполняет `tsc -b && vite build`).
- Просмотр продакшен-версии: `npm run preview`.
- Линт: `npm run lint` (ESLint конфиг: `eslint.config.js`).

Переменные окружения и интеграции

- Базовый URL бэкенда: `VITE_API_URL` (используется в [src/stores/api.ts](src/stores/api.ts#L1)). По умолчанию — `http://localhost:4000`.
- Авторизация: JWT-token хранится в `localStorage` под ключом `token`; axios-интерсептор добавляет `Authorization: Bearer <token>` (см. [src/stores/api.ts](src/stores/api.ts#L1)).

Проектно-специфичные соглашения и паттерны

- MobX stores: каждый store — отдельный класс (`makeAutoObservable`) с экшенами/геттерами. Экспортируются из `src/stores/index.ts`.
- Компоненты: папка + `index.ts` реэкспортирует дефолтный экспорт; потребляйте компоненты через корневой импорт: `import { Button, Input } from 'src/components'` (см. [src/components/index.ts](src/components/index.ts#L1)).
- Реактивность в компонентах: используйте `observer` из `mobx-react-lite` для компонентов, которые читают store (пример в `docs/architecture.md`).
- UI/CSS: глобальные CSS-переменные и BEM-подход в `src/index.css` и по всем компонентам (см. `docs/architecture.md` — раздел CSS).
- Хуки: `useForm` и `useApi` находятся в [src/hooks](src/hooks) — предпочитайте их для форм и асинхронных fetch-паттернов.

Важные файлы / места для правок

- Точка входа: [src/main.tsx](src/main.tsx#L1).
- Роутинг и layout: [src/App.tsx](src/App.tsx#L1), [src/components/Layout/Layout.tsx](src/components/Layout/Layout.tsx#L1).
- API-инстанс: [src/stores/api.ts](src/stores/api.ts#L1) — изменять осторожно, учитывайте interceptors.
- Auth flow: [src/stores/AuthStore.ts](src/stores/AuthStore.ts#L1) — `checkAuth`, `loginUser`, `logout` и `refreshUser` используют `/auth/*` endpoints.
- GitHub data: [src/stores/GitHubStore.ts](src/stores/GitHubStore.ts#L1) — содержит хардкоженный `USERNAME`, список `TARGET_REPO_NAMES` и `CUSTOM_DESCRIPTIONS`.

Примеры часто нужных изменений

- Добавить новый store: создать файл в `src/stores`, реализовать класс с `makeAutoObservable`, добавить экспорт в `src/stores/index.ts`.
- Добавить компонент: создать папку в `src/components/Name`, экспорт по умолчанию внутри `index.ts`, обновить центральный реэкспорт в `src/components/index.ts`.
- Обновить API-путь: предпочитайте менять `VITE_API_URL` при развертывании; для временных изменений правьте `src/stores/api.ts` только с согласованием.

PR и доки

- Малые изменения — один pull request, подробный коммит-месседж, обновляйте `docs/` (особенно `docs/architecture.md`) при изменениях структуры.
- Перед мерджем запустите `npm run build` и `npm run lint` локально.

Чего избегать

- Не дублировать store-логику в компонентах — держите side-effect и fetch в store/hook.
- Не меняйте интерцепторы axios без тестовой проверки поведения аутентификации.

Где читать дальше

- Обзор проекта: [docs/project_overview.md](docs/project_overview.md)
- Установка: [docs/setup_guide.md](docs/setup_guide.md)
- Архитектура: [docs/architecture.md](docs/architecture.md)

Обратная связь

- Если что-то не покрыто или нужно больше примеров — скажите, какие файлы/фичи разобрать подробнее.
