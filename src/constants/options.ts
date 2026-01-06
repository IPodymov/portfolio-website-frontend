import { ProjectType, ServiceQuality, ProjectStatus } from '../types';

export const PROJECT_TYPE_OPTIONS = [
  { value: ProjectType.LANDING, label: 'Лендинг' },
  { value: ProjectType.ECOMMERCE, label: 'Интернет-магазин' },
  { value: ProjectType.WEBAPP, label: 'Веб-приложение' },
  { value: ProjectType.BOT, label: 'Telegram бот' },
  { value: ProjectType.OTHER, label: 'Другое' },
];

export const SERVICE_QUALITY_OPTIONS = [
  { value: ServiceQuality.EXCELLENT, label: 'Отлично' },
  { value: ServiceQuality.GOOD, label: 'Хорошо' },
  { value: ServiceQuality.NORMAL, label: 'Нормально' },
  { value: ServiceQuality.BAD, label: 'Плохо' },
  { value: ServiceQuality.TERRIBLE, label: 'Ужасно' },
];

export const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.PENDING, label: 'Ожидает' },
  { value: ProjectStatus.IN_PROGRESS, label: 'В работе' },
  { value: ProjectStatus.COMPLETED, label: 'Завершён' },
  { value: ProjectStatus.CANCELLED, label: 'Отменён' },
];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  [ProjectType.LANDING]: 'Лендинг',
  [ProjectType.ECOMMERCE]: 'Интернет-магазин',
  [ProjectType.WEBAPP]: 'Веб-приложение',
  [ProjectType.BOT]: 'Telegram бот',
  [ProjectType.OTHER]: 'Другое',
};

export const SERVICE_QUALITY_LABELS: Record<ServiceQuality, string> = {
  [ServiceQuality.EXCELLENT]: 'Отлично',
  [ServiceQuality.GOOD]: 'Хорошо',
  [ServiceQuality.NORMAL]: 'Нормально',
  [ServiceQuality.BAD]: 'Плохо',
  [ServiceQuality.TERRIBLE]: 'Ужасно',
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PENDING]: 'Ожидает',
  [ProjectStatus.IN_PROGRESS]: 'В работе',
  [ProjectStatus.COMPLETED]: 'Завершён',
  [ProjectStatus.CANCELLED]: 'Отменён',
};
