import { forNamespace } from '@trello/i18n';
import { ActionType, TriggerType } from '@atlassian/butler-command-parser';
import { ACTION_METADATA } from './ActionMetadata';
import { TRIGGER_METADATA } from './TriggerMetadata';
import { UNKNOWN_CATEGORY } from './types';

export const formatCommandElementCategory = forNamespace([
  'butler',
  'command element categories',
]);

export const formatActionCategory = (type: ActionType) =>
  formatCommandElementCategory(
    ACTION_METADATA[type]?.category ?? UNKNOWN_CATEGORY,
  );

export const formatTriggerCategory = (type: TriggerType) =>
  formatCommandElementCategory(
    TRIGGER_METADATA[type]?.category ?? UNKNOWN_CATEGORY,
  );
