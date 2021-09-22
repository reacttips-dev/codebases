import type BaseFolderId from 'owa-service/lib/contract/BaseFolderId';
import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';
import type SortResults from 'owa-service/lib/contract/SortResults';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import type FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import constant from 'owa-service/lib/factory/constant';
import fieldURIOrConstantType from 'owa-service/lib/factory/fieldURIOrConstantType';
import isEqualTo from 'owa-service/lib/factory/isEqualTo';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import restrictionType from 'owa-service/lib/factory/restrictionType';
import seekToConditionPageView from 'owa-service/lib/factory/seekToConditionPageView';
import { findItem, getFindItemTraversal } from 'owa-mail-find-rows';
import type RequestOptions from 'owa-service/lib/RequestOptions';

/**
 * The findItemWithSeekToInstanceKeyCondition is based on the instance key of the last row present locally in the table.
 * This is currently used for load more scenario
 * @param baseFolderId - The base folderId for which we are fetching the data
 * @param instanceKey - We use instancekey of the last item we have in the loaded rows in the table.
 * @param rowsToLoad - the number of rows to load
 * @param viewFilter - view filter (e.g - Unread\Flag)
 * @param sortResults - sort by properties
 * @param focusedViewFilter - focused view filter
 * @param findItemShapeName - the shape for the request
 * @param options - optional parameters to be passed to request (method and/or headers)
 * @param categoryName - the category name
 * @param searchFolderId the search folder id
 * @returns a promise of type FindItemResponseMessage
 */
export function findItemWithSeekToInstanceKeyCondition(
    baseFolderId: BaseFolderId,
    instanceKey: string,
    rowsToLoad: number,
    viewFilter: ViewFilter,
    sortResults: SortResults[],
    focusedViewFilter: FocusedViewFilter,
    findItemShapeName: string,
    options: RequestOptions,
    categoryName: string,
    searchFolderId?: BaseFolderId
): Promise<FindItemResponseMessage> {
    const restriction = isEqualTo({
        FieldURIOrConstant: fieldURIOrConstantType({
            Item: constant({
                Value: instanceKey,
            }),
        }),
        Item: propertyUri({
            FieldURI: 'InstanceKey',
        }),
    });

    const seekToCondition = restrictionType({
        Item: restriction,
    });

    const paging = seekToConditionPageView({
        BasePoint: 'Beginning',
        Condition: seekToCondition,
        MaxEntriesReturned: rowsToLoad,
    });

    return findItem(
        baseFolderId,
        paging,
        viewFilter,
        sortResults,
        focusedViewFilter,
        findItemShapeName,
        options,
        categoryName,
        getFindItemTraversal(viewFilter),
        searchFolderId
    );
}
