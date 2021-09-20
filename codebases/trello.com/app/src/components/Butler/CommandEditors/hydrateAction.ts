import { Action, ActionType } from '@atlassian/butler-command-parser';

/**
 * Helper function for cases where an action has non-optional fields, and needs
 * to be hydrated prior to being appended to the actions array.
 * @param type
 * @example
 * hydrate('MOVE_CARD_ACTION');
 * // Outputs `{ type: 'MOVE_CARD_ACTION', MOVE_CARD_ACTION: { DESTINATION: {} } }`
 */
export const hydrateAction = (type: ActionType): Action => {
  // @ts-expect-error
  const action: Action = { type, [type]: {} };
  switch (action.type) {
    case 'MOVE_CARD_ACTION':
      action[action.type].DESTINATION = { POSITION_TOP: 'top' };
      break;
    case 'COPY_CARD_ACTION':
      action[action.type].DESTINATION = { POSITION_TOP: 'top' };
      break;
    case 'MARK_DUE_COMPLETE_ACTION':
      action[action.type] = true;
      break;
    case 'UNMARK_DUE_COMPLETE_ACTION':
      action[action.type] = true;
      break;
    case 'REMOVE_FROM_CARD_ACTION':
      action[action.type].REMOVE_ALL_MEMBERS = true;
      break;
    case 'JOIN_CARD_ACTION':
      action[action.type] = true;
      break;
    case 'ADD_START_DATE_ACTION':
      action[action.type].START_DATE = {
        IN_X_FROM_TODAY: { X_WORKING_DAYS: 3 },
      };
      break;
    case 'ADD_DUE_DATE_ACTION':
      action[action.type].DUE_DATE = {
        IN_X_FROM_TODAY: { X_WORKING_DAYS: 3 },
      };
      break;
    case 'SORT_LIST_ACTION':
      action[action.type] = { SORT_ASCENDING: true, SORT_BY_DUE_DATE: true };
      break;
    case 'ADD_LABEL_ACTION':
      action[action.type].LABEL = {};
      break;
    default:
      break;
  }
  return action;
};
