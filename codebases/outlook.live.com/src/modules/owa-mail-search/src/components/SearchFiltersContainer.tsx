import { moreFilters, time } from './SearchFiltersContainer.locstring.json';
import { getMoreFiltersButtonStyles } from './SearchFilterStyles';
import SearchFilterToggle from './SearchFilterToggle';
import TimeSearchFilter, { timeDropdownOptions } from './TimeSearchFilter';
import { setShouldShowAdvancedSearch } from '../actions/publicActions';
import { SearchFilterItemInstrumentationContext } from '../store/schema/FiltersInstrumentationContext';
import { getStore } from '../store/store';
import {
    logInitialFiltersInstrumentation,
    logFilterClientEvent,
} from '../utils/filterInstrumentationUtils';
import getSearchQueryHasAttachmentsKqlMatches from '../utils/getSearchQueryHasAttachmentsKqlMatches';
import { ActionButton, CommandBarButton } from '@fluentui/react/lib/Button';
import { IOverflowSetItemProps, OverflowSet } from '@fluentui/react/lib/OverflowSet';
import { ResizeGroup } from '@fluentui/react/lib/ResizeGroup';
import { mergeStyles } from '@uifabric/merge-styles';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import { ControlIcons } from 'owa-control-icons';
import { getGuid } from 'owa-guid';
import loc from 'owa-localize';
import { flaggedFilter } from 'owa-locstrings/lib/strings/flaggedfilter.locstring.json';
import { mentionsFilter } from 'owa-locstrings/lib/strings/mentionsFilter.locstring.json';
import { searchFilterLabel_hasAttachment } from 'owa-locstrings/lib/strings/searchFilterLabel.locstring.json';
import { toMeFilter } from 'owa-locstrings/lib/strings/toMeFilter.locstring.json';
import { unreadFilter } from 'owa-locstrings/lib/strings/unreadfilter.locstring.json';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import { lazyIsSearchBoxEmpty } from 'owa-search';
import { startSearch } from 'owa-search-actions';
import { getScenarioStore, SearchScenarioId } from 'owa-search-store';
import { getPalette } from 'owa-theme';
import * as React from 'react';
import {
    toggleIsUnread,
    toggleIsToMe,
    toggleHasAttachments,
    toggleIsFlagged,
    toggleIsMentioned,
} from '../actions/internalActions';
import type { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react/lib/ContextualMenu';
import getTimeFilterDropdownValue, {
    TimeDropdownValue,
} from '../selectors/getTimeFilterDropdownValue';

enum SearchFilterType {
    Unread,
    Time,
    HasAttachments,
    ToMe,
    Flagged,
    Mentioned,
    MoreFilters,
}

interface IOverflowData {
    primary: IOverflowSetItemProps[];
    overflow: IContextualMenuItem[];
    cacheKey: string;
}

interface SearchFilterItem {
    key: string;
    searchFilterType: SearchFilterType;
    text: string;
    canCheck: boolean;
    checked: boolean;
    onClick: () => void;
    subMenuProps?: IContextualMenuProps;
}

export default observer(function SearchFiltersContainer(): JSX.Element {
    const mailSearchStore = getStore();
    const searchStore = getScenarioStore(SearchScenarioId.Mail);
    const palette = getPalette();

    const hasAttachmentsKqlMatch = useComputedValue(() => {
        const { searchText: searchBoxText } = searchStore;
        const matches = getSearchQueryHasAttachmentsKqlMatches(searchBoxText);
        let hasMatch = false;
        if (matches?.length > 0) {
            // Use last value if user has typed multiple kql values
            const value = matches.pop().substring(15 /* hasattachments: */).toLocaleLowerCase();
            hasMatch = value === 'yes' || value === 'true';
        }
        return hasMatch;
    });

    const onMoreFiltersClick = (evt: React.MouseEvent<unknown>) => {
        logUsage('SearchFilter_MoreFiltersClicked');
        logFilterClientEvent('MoreFilters', true);
        setShouldShowAdvancedSearch(true);
    };

    const onSearchFilterClick = React.useCallback((filterType: SearchFilterType) => {
        const isSearchBoxEmpty = lazyIsSearchBoxEmpty.tryImportForRender();
        return () => {
            switch (filterType) {
                case SearchFilterType.Unread:
                    toggleIsUnread();
                    break;
                case SearchFilterType.HasAttachments:
                    toggleHasAttachments();
                    break;
                case SearchFilterType.ToMe:
                    toggleIsToMe();
                    break;
                case SearchFilterType.Flagged:
                    toggleIsFlagged();
                    break;
                case SearchFilterType.Mentioned:
                    toggleIsMentioned();
                    break;
            }
            if (!isSearchBoxEmpty(SearchScenarioId.Mail)) {
                startSearch('InteractiveFilter', SearchScenarioId.Mail, false /* explicitSearch */);
            }
        };
    }, []);

    const getSearchFilterContextMenuItem = (
        filterType: SearchFilterType,
        text: string,
        isSelected: boolean,
        subMenuProps?: IContextualMenuProps
    ): SearchFilterItem => {
        return {
            key: filterType.toString(),
            searchFilterType: filterType,
            text: text,
            canCheck: true,
            checked: isSelected,
            onClick: onSearchFilterClick(filterType),
            subMenuProps: subMenuProps,
        };
    };

    const filterItems = [
        getSearchFilterContextMenuItem(
            SearchFilterType.Unread,
            loc(unreadFilter),
            mailSearchStore.isUnread
        ),
        getSearchFilterContextMenuItem(
            SearchFilterType.Time,
            loc(time),
            getTimeFilterDropdownValue() !== TimeDropdownValue.anyDate,
            { items: timeDropdownOptions }
        ),
        getSearchFilterContextMenuItem(
            SearchFilterType.HasAttachments,
            loc(searchFilterLabel_hasAttachment),
            hasAttachmentsKqlMatch || mailSearchStore.includeAttachments
        ),
        getSearchFilterContextMenuItem(
            SearchFilterType.ToMe,
            loc(toMeFilter),
            mailSearchStore.isToMe
        ),
        getSearchFilterContextMenuItem(
            SearchFilterType.Flagged,
            loc(flaggedFilter),
            mailSearchStore.isFlagged
        ),
        getSearchFilterContextMenuItem(
            SearchFilterType.Mentioned,
            loc(mentionsFilter),
            mailSearchStore.isMentioned
        ),
        {
            key: 'divider',
            text: '-',
        },
        {
            key: 'moreFilters',
            text: loc(moreFilters),
            itemProps: { styles: { label: mergeStyles({ color: palette.themePrimary }) } },
            searchFilterType: SearchFilterType.MoreFilters,
            onClick: onMoreFiltersClick,
        },
    ];

    const onRenderFilterPrimary = React.useCallback(
        (item: IOverflowSetItemProps) => {
            switch (item.searchFilterType) {
                case SearchFilterType.Unread:
                    return (
                        <SearchFilterToggle
                            label={loc(unreadFilter)}
                            isSelected={mailSearchStore.isUnread}
                            onClick={onSearchFilterClick(SearchFilterType.Unread)}
                        />
                    );
                case SearchFilterType.Time:
                    return <TimeSearchFilter />;
                case SearchFilterType.HasAttachments:
                    return (
                        <SearchFilterToggle
                            label={loc(searchFilterLabel_hasAttachment)}
                            isSelected={
                                hasAttachmentsKqlMatch || mailSearchStore.includeAttachments
                            }
                            onClick={onSearchFilterClick(SearchFilterType.HasAttachments)}
                        />
                    );
                case SearchFilterType.ToMe:
                    return (
                        <SearchFilterToggle
                            label={loc(toMeFilter)}
                            isSelected={mailSearchStore.isToMe}
                            onClick={onSearchFilterClick(SearchFilterType.ToMe)}
                        />
                    );
                case SearchFilterType.Flagged:
                    return (
                        <SearchFilterToggle
                            label={loc(flaggedFilter)}
                            isSelected={mailSearchStore.isFlagged}
                            onClick={onSearchFilterClick(SearchFilterType.Flagged)}
                        />
                    );
                case SearchFilterType.Mentioned:
                    return (
                        <SearchFilterToggle
                            label={loc(mentionsFilter)}
                            isSelected={mailSearchStore.isMentioned}
                            onClick={onSearchFilterClick(SearchFilterType.Mentioned)}
                        />
                    );
                case SearchFilterType.MoreFilters:
                    return (
                        <ActionButton
                            styles={getMoreFiltersButtonStyles()}
                            onClick={onMoreFiltersClick}
                            text={loc(moreFilters)}
                        />
                    );
                default:
                    return null;
            }
        },
        [
            mailSearchStore.isUnread,
            hasAttachmentsKqlMatch,
            mailSearchStore.includeAttachments,
            mailSearchStore.isToMe,
            mailSearchStore.isFlagged,
            mailSearchStore.isMentioned,
        ]
    );

    const generateData = (): IOverflowData => {
        const dataItems = [];
        let cacheKey = '';
        for (const filter of filterItems) {
            cacheKey += filter.key;
            dataItems.push({ ...filter });
        }
        const result: IOverflowData = {
            primary: dataItems,
            overflow: [] as IContextualMenuItem[],
            cacheKey: cacheKey,
        };
        return result;
    };

    const computeCacheKey = (primaryData: IOverflowSetItemProps[]): string => {
        return primaryData.map(data => data.key).join();
    };

    const onRenderOverflowButton = (overflowItems: any) => (
        <CommandBarButton
            menuProps={{ items: overflowItems! }}
            menuIconProps={{
                iconName: ControlIcons.More,
            }}
        />
    );

    const onRenderData = (data: any) => {
        return (
            <OverflowSet
                styles={{ root: { alignItems: 'center' } }}
                items={data.primary}
                overflowItems={data.overflow}
                onRenderItem={onRenderFilterPrimary}
                onRenderOverflowButton={onRenderOverflowButton}
            />
        );
    };

    const onReduceData = (currentData: any) => {
        if (currentData.primary.length === 0) {
            return undefined;
        }
        const overflow = [...currentData.primary.slice(-1), ...currentData.overflow];
        const primary = currentData.primary.slice(0, -1);
        const cacheKey = computeCacheKey(primary);
        return { primary, overflow, cacheKey };
    };

    if (!mailSearchStore.filtersInstrumentationContext) {
        const searchFilterItems: SearchFilterItemInstrumentationContext[] = filterItems.map(
            function (filter) {
                const searchFilterItem = filter as SearchFilterItem;
                if (searchFilterItem && filter.searchFilterType !== undefined) {
                    const item: SearchFilterItemInstrumentationContext = {
                        name: SearchFilterType[filter.searchFilterType],
                        referenceId: getGuid(),
                        selected: searchFilterItem.checked,
                        subMenuItems: [],
                    };

                    const subFilterItems = searchFilterItem?.subMenuProps?.items;
                    if (subFilterItems) {
                        for (const subFilter of subFilterItems) {
                            item.subMenuItems.push({
                                name: subFilter.key,
                                referenceId: getGuid(),
                                selected: getTimeFilterDropdownValue() == subFilter.key,
                                subMenuItems: [],
                            });
                        }
                    }

                    return item;
                }

                return null;
            }
        );

        logInitialFiltersInstrumentation(searchFilterItems);
    }

    return (
        <ResizeGroup
            className={mergeStyles({ flex: '1 1 auto' })}
            data={generateData()}
            onReduceData={onReduceData}
            onRenderData={onRenderData}
        />
    );
});
