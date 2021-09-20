/* eslint-disable @trello/export-matches-filename */

import { freeze } from '@trello/objects';
import { ActionType } from '@atlassian/butler-command-parser';
import { forNamespace } from '@trello/i18n';
import { CommandElementCategory, ActionContext, ActionMetadata } from './types';

/**
 * All the associated metadata for an action, sort of sorted by category.
 * Order isn't as important as consistency, so please try to keep this sorted!
 */
export const ACTION_METADATA = freeze<
  Partial<Record<ActionType, ActionMetadata>>
>({
  // Move
  MOVE_CARD_ACTION: {
    category: CommandElementCategory.Move,
    requiredContext: [ActionContext.Card],
  },

  // Copy
  COPY_CARD_ACTION: {
    category: CommandElementCategory.Copy,
    requiredContext: [ActionContext.Card],
  },

  // Labels
  ADD_LABEL_ACTION: {
    category: CommandElementCategory.Labels,
    requiredContext: [ActionContext.Card],
  },

  // Members
  JOIN_CARD_ACTION: {
    category: CommandElementCategory.Members,
    requiredContext: [ActionContext.Card],
  },

  // Dates
  ADD_DUE_DATE_ACTION: {
    category: CommandElementCategory.Dates,
    requiredContext: [ActionContext.Card],
  },
  ADD_START_DATE_ACTION: {
    category: CommandElementCategory.Dates,
    requiredContext: [ActionContext.Card],
  },
  MARK_DUE_COMPLETE_ACTION: {
    category: CommandElementCategory.Dates,
    requiredContext: [ActionContext.Card],
  },
  UNMARK_DUE_COMPLETE_ACTION: {
    category: CommandElementCategory.Dates,
    requiredContext: [ActionContext.Card],
  },

  // Remove
  REMOVE_FROM_CARD_ACTION: {
    category: CommandElementCategory.Remove,
    requiredContext: [ActionContext.Card],
  },

  // Sort
  SORT_LIST_ACTION: {
    category: CommandElementCategory.Sort,
    // Without list context, editor should have a Select for the list.
  },

  // Add

  // Checklists

  // Confetti

  // Content

  // Fields

  // Archive
});

const forActionLabelNamespace = forNamespace(['butler', 'action labels'], {
  returnBlankForMissingStrings: true,
});
export const formatActionLabel: (
  type: ActionType,
) => string = forActionLabelNamespace;
