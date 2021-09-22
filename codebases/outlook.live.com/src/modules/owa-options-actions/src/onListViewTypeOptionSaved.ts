import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs';

export let onListViewTypeOptionSaved = action(
    'ON_LIST_VIEW_TYPE_OPTION_SAVED',
    (newListViewType: ReactListViewType) => {
        return {
            newListViewType,
        };
    }
);
