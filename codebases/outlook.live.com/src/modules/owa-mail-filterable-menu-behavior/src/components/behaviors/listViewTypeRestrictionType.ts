import { ListViewTypeRestrictionType } from '../Behaviors.types';
import { assertNever } from 'owa-assert';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getSelectedTableView } from 'owa-mail-list-store';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';

export const listViewTypeRestrictionType = (
    listViewTypeRestrictionType: ListViewTypeRestrictionType
) => () => {
    const {
        tableQuery: { listViewType },
    } = getSelectedTableView();

    switch (listViewTypeRestrictionType) {
        case ListViewTypeRestrictionType.Message:
            return listViewType === ReactListViewType.Message || shouldShowUnstackedReadingPane();

        case ListViewTypeRestrictionType.Conversation:
            return (
                listViewType === ReactListViewType.Conversation && !shouldShowUnstackedReadingPane()
            );

        default:
            throw assertNever(listViewTypeRestrictionType);
    }
};
