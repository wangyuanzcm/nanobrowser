import { t } from '@extension/i18n';

export const ACTOR_PROFILES = {
  user: {
    name: t('actor_user'),
    icon: 'icons/user.svg',
    iconBackground: '#4CAF50',
  },
  system: {
    name: t('actor_system'),
    icon: 'icons/system.svg',
    iconBackground: '#2196F3',
  },
  planner: {
    name: t('actor_planner'),
    icon: 'icons/planner.svg',
    iconBackground: '#FF9800',
  },
  navigator: {
    name: t('actor_navigator'),
    icon: 'icons/navigator.svg',
    iconBackground: '#40A9FF',
  },
  validator: {
    name: t('actor_validator'),
    icon: 'icons/validator.svg',
    iconBackground: '#EC407A',
  },
  manager: {
    name: t('actor_manager'),
    icon: 'icons/manager.svg',
    iconBackground: '#9C27B0',
  },
  evaluator: {
    name: t('actor_evaluator'),
    icon: 'icons/evaluator.svg',
    iconBackground: '#795548',
  },
} as const;
