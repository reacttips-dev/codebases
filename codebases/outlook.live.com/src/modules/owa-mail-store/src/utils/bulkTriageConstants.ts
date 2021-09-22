/**
 * Maximum number of items to display as part of a header for confirmation dialogs,
 * i.e. "Delete 10,000 items". If the number is greater than this value, then we'll
 * show the "VALUE+" instead.
 */
export const MAX_LABEL_ITEM_COUNT = 10000;

/**
 * The threshold required to show a confirmation dialog. If the number
 * of selected items is lower than this value, we won't show a confirmation
 * dialog for whatever action is being performed.
 */
export const NUMBER_OF_SELECTED_ITEMS_THRESHOLD = 25;
