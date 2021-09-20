/* eslint-disable @trello/disallow-filenames */
import { FC } from 'react';
import { RuleCommandType } from '@atlassian/butler-command-parser';
import { IconProps } from '@trello/nachos/icon';

/**
 * Many Butler actions are only available in specific contexts, and this can be
 * meaningfully different from command type. For example, MOVE_CARD_ACTION can't
 * be chained to a rule with an EVERY_DAY trigger because there is no card in
 * context to target, but it is viable for a rule with a CARD_INTO_LIST trigger.
 */
export enum ActionContext {
  Card = 'card',
  Checklist = 'checklist',
  List = 'list',
  Report = 'report',
}

/**
 * Used for command element (i.e. Trigger, Condition, or Action) icons.
 * Not extremely meaningful that these are all combined into a generic
 * CommandElement grouping, but the majority of these are shared.
 */
export enum CommandElementCategory {
  Add = 'add',
  Archive = 'archive',
  Calendar = 'calendar',
  CardChanges = 'card changes',
  CardsAndLists = 'cards and lists',
  Checklists = 'checklists',
  Confetti = 'confetti',
  Content = 'content',
  Copy = 'copy',
  Dates = 'dates',
  Email = 'emails',
  Fields = 'fields',
  Labels = 'labels',
  Members = 'members',
  Move = 'move',
  Remove = 'remove',
  Sort = 'sort',
}

export const UNKNOWN_CATEGORY = CommandElementCategory.Confetti;

export interface ActionMetadata {
  category: CommandElementCategory;
  /**
   * Some actions provide context; e.g. CREATE_CARD_ACTION provides context for
   * a card that is targetable by subsequent actions in the same command.
   */
  providedContext?: ActionContext[];
  /**
   * Some actions are only available for a specific context; e.g.
   * MOVE_CARD_ACTION can't be chained to a rule with an EVERY_DAY trigger,
   * but it is viable for a rule with a CARD_INTO_LIST trigger.
   */
  requiredContext?: ActionContext[];
}

export interface TriggerMetadata {
  category: CommandElementCategory;
  commandType: RuleCommandType;
  providedContext?: ActionContext[];
}

export type IconComponent = FC<Partial<IconProps>>;
