import { SortListAction } from '@atlassian/butler-command-parser';
import { hydrateAction } from '../CommandEditors';
import { listRuleDraftState } from './listRuleDraftState';

// Matches translation keys defined in template-strings/list_menu.json
export type ButlerListRuleTemplate =
  | 'when-a-card-is-added-to-the-list'
  | 'every-day-sort-list-by'
  | 'every-monday-sort-list-by';

export const hydrateListRuleTemplate = ({
  template,
  listName,
}: {
  template: ButlerListRuleTemplate;
  listName: string;
}) => {
  switch (template) {
    case 'when-a-card-is-added-to-the-list': {
      listRuleDraftState.setValue({
        TRIGGER: {
          type: 'WHEN',
          WHEN: {
            type: 'CARD_INTO_LIST',
            CARD_INTO_LIST: {
              $LIST: listName,
            },
          },
        },
        ACTION: [],
      });
      return;
    }
    case 'every-day-sort-list-by': {
      const action = hydrateAction('SORT_LIST_ACTION') as SortListAction;
      action.SORT_LIST_ACTION.$LIST = listName;
      listRuleDraftState.setValue({
        TRIGGER: {
          type: 'EVERY',
          EVERY: {
            type: 'EVERY_DAY',
            EVERY_DAY: true,
          },
        },
        ACTION: [action],
      });
      return;
    }
    case 'every-monday-sort-list-by': {
      const action = hydrateAction('SORT_LIST_ACTION') as SortListAction;
      action.SORT_LIST_ACTION.$LIST = listName;
      listRuleDraftState.setValue({
        TRIGGER: {
          type: 'EVERY',
          EVERY: {
            type: 'CERTAIN_DAYS',
            CERTAIN_DAYS: {
              DAY: 1,
            },
          },
        },
        ACTION: [action],
      });
      return;
    }
    default:
      throw new Error(`Invalid template: ${template}`);
  }
};
