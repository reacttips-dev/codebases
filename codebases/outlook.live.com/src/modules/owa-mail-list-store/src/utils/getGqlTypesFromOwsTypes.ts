import { SortColumn, TableQueryType } from '../index';
import type {
    SortColumn as GqlSortColumn,
    ViewFilter as GqlViewFilter,
    FocusedViewFilter as GqlFocusedViewFilter,
    ReactListViewType as GqlReactListViewType,
    TableQueryType as GqlTableQueryType,
} from 'owa-graph-schema';
import { assertNever } from 'owa-assert';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

export function getGqlSortColumnFromOwsSortColumn(sortColumn: SortColumn): GqlSortColumn {
    switch (sortColumn) {
        case SortColumn.Date:
            return 'Date';
        case SortColumn.From:
            return 'From';
        case SortColumn.Importance:
            return 'Importance';
        case SortColumn.Size:
            return 'Size';
        case SortColumn.Subject:
            return 'Subject';
        default:
            return assertNever(sortColumn);
    }
}

export function getGqlViewFilterFromOwsViewFilter(viewFilter: ViewFilter): GqlViewFilter {
    switch (viewFilter) {
        case 'All':
        case 'Flagged':
        case 'HasAttachment':
        case 'ToOrCcMe':
        case 'Unread':
        case 'UserCategory':
        case 'Focused':
        case 'Mentioned':
        case 'HasFile':
            return viewFilter;
        default:
            assertNever(viewFilter as never);
    }
}

export function getGqlFocusedViewFilterFromOwsFocusedViewFilter(
    focusedViewFilter: FocusedViewFilter
): GqlFocusedViewFilter {
    switch (focusedViewFilter) {
        case FocusedViewFilter.None:
            return 'None';
        case FocusedViewFilter.Focused:
            return 'Focused';
        case FocusedViewFilter.Other:
            return 'Other';
        default:
            assertNever(focusedViewFilter);
    }
}

export function getGqlReactListViewTypeFromOwsReactListViewType(
    reactListViewType: ReactListViewType
): GqlReactListViewType {
    switch (reactListViewType) {
        case ReactListViewType.Conversation:
            return 'Conversation';
        case ReactListViewType.Message:
            return 'Message';
        case ReactListViewType.CalendarItems:
            return 'CalendarItems';
        default:
            assertNever(reactListViewType);
    }
}

export function getGqlTableQueryTypeFromOwaTableQueryType(type: TableQueryType): GqlTableQueryType {
    switch (type) {
        case TableQueryType.Folder:
            return 'Folder';
        case TableQueryType.Search:
            return 'Search';
        case TableQueryType.Group:
            return 'Group';
        default:
            assertNever(type);
    }
}
