/* eslint-disable @trello/export-matches-filename */

import { freeze } from '@trello/objects';
import { Trigger, TriggerType } from '@atlassian/butler-command-parser';
import {
  ActionContext,
  CommandElementCategory,
  TriggerMetadata,
} from './types';

export const TRIGGER_METADATA = freeze<
  Partial<Record<TriggerType, TriggerMetadata>>
>({
  CARD_INTO_LIST: {
    category: CommandElementCategory.CardsAndLists,
    commandType: 'rule',
    providedContext: [ActionContext.Card, ActionContext.List],
  },
  EVERY_DAY: {
    category: CommandElementCategory.Calendar,
    commandType: 'schedule',
  },
  CERTAIN_DAYS: {
    category: CommandElementCategory.Calendar,
    commandType: 'schedule',
  },
});

export const getTriggerType = (trigger?: Trigger): TriggerType | null =>
  trigger?.[trigger.type]?.type ?? null;

export const getTriggerMetadata = (
  trigger?: Trigger,
): TriggerMetadata | null => {
  const triggerType = getTriggerType(trigger);
  if (triggerType) {
    return TRIGGER_METADATA[triggerType] ?? null;
  }
  return null;
};
