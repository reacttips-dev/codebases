import { getSelectedTableView, TableView } from 'owa-mail-list-store';
import { ListRestrictionType } from '../Behaviors.types';
import { assertNever } from 'owa-assert';

export const listRestrictionType = (listRestrictionType: ListRestrictionType) => () => {
    const tableView: TableView = getSelectedTableView();

    // Check if we have the right number of items on listview;
    switch (listRestrictionType) {
        case ListRestrictionType.Empty:
            return tableView.rowKeys.length == 0;

        case ListRestrictionType.WithItems:
            return tableView.rowKeys.length > 0;

        default:
            throw assertNever(listRestrictionType);
    }
};
