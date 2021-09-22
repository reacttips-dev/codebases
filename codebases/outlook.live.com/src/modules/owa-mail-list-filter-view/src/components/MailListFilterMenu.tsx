import { observer } from 'mobx-react-lite';
import { mailFilter, spotlightFilter } from '../strings.locstring.json';
import loc from 'owa-localize';
import getViewFilterDisplay from '../helpers/getViewFilterDisplay';
import { Icon } from '@fluentui/react/lib/Icon';
import { lazySelectFilter, lazyClearSpotlightFilter } from 'owa-mail-filter-actions';
import type { ActionSource } from 'owa-mail-store';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import MailFilterContextMenu from './MailFilterContextMenu';
import { getViewFilterForTable, listViewStore, MailFolderTableQuery } from 'owa-mail-list-store';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import * as React from 'react';
import {
    filterViewStore,
    hideFilterDropDownContextMenu,
    showFilterDropDownContextMenu,
} from 'owa-mail-list-filter-store';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';
import { default as Filter } from 'owa-fluent-icons-svg/lib/icons/FilterRegular';
import { default as ArrowCurveUpRight } from 'owa-fluent-icons-svg/lib/icons/ArrowCurveUpRightRegular';
import { default as ArrowCurveDownRight } from 'owa-fluent-icons-svg/lib/icons/ArrowCurveDownRightRegular';
import { default as Dismiss } from 'owa-fluent-icons-svg/lib/icons/DismissRegular';

import styles from './MailListFilterMenu.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListFilterMenuProps {
    supportedViewFilters: ViewFilter[];
    filterMenuSource: ActionSource;
    tableViewId: string;
    containerClassName?: string;
    isInboxWithPivots?: boolean;
}

export default observer(function MailListFilterMenu(props: MailListFilterMenuProps) {
    const container = React.useRef<HTMLElement>();

    const tableView = listViewStore.tableViews.get(props.tableViewId);

    const currentSelectedFilter = getViewFilterForTable(tableView);
    const mailFolderTableQuery = tableView.tableQuery as MailFolderTableQuery;
    const isImportantView = mailFolderTableQuery.scenarioType === 'spotlight';
    const isAllFilterSelected = currentSelectedFilter == 'All' && !isImportantView;
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const onFilterClick = (evt: React.MouseEvent<unknown> | React.KeyboardEvent<HTMLElement>) => {
        evt.stopPropagation();
        const isFilterShowing = filterViewStore.filterContextMenuDisplayState;

        // If user is not in the 'All' filter, clicking on the filter should change to 'All'
        // Otherwise, if the user is in the 'All' filter and the filter menu is showing, we should dismiss it
        // but if the filter menu is closed, we should open it.
        if (isImportantView) {
            lazyClearSpotlightFilter.importAndExecute(props.filterMenuSource);
        } else if (!isAllFilterSelected) {
            lazySelectFilter.importAndExecute('All', props.filterMenuSource);
        } else if (isFilterShowing) {
            dismissContextMenu();
        } else {
            showFilterDropDownContextMenu();
        }
    };
    /**
     * Called when user presses keyboard on the filter dropdown title in listview
     */
    const onKeyDownOnFilter = (evt: React.KeyboardEvent<HTMLElement>) => {
        if (evt.keyCode === KeyboardCharCodes.Enter || evt.keyCode === KeyboardCharCodes.Space) {
            evt.preventDefault();
            onFilterClick(evt);
        }
    };
    const containerClassNames = classNames(
        props.containerClassName,
        props.isInboxWithPivots && styles.filterPivots,
        filterViewStore.filterContextMenuDisplayState ? styles.filterAllOpened : styles.filterAll,
        hasDensityNext && styles.filterContainerNext
    );
    const ariaProps: AriaProperties = {
        role: AriaRoles.button,
    };
    const filterMenuText = React.useMemo(() => {
        if (isAllFilterSelected) {
            return loc(mailFilter);
        }

        if (isImportantView) {
            return loc(spotlightFilter);
        }

        return getViewFilterDisplay(currentSelectedFilter);
    }, [props.tableViewId]);

    const sortDirection = mailFolderTableQuery?.sortBy?.sortDirection;

    const sortIconNext =
        sortDirection && (sortDirection == 'Ascending' ? ArrowCurveUpRight : ArrowCurveDownRight);

    let filterMenuIcon;

    if (isAllFilterSelected) {
        filterMenuIcon = hasDensityNext ? sortIconNext : ControlIcons.ChevronDownMed;
    } else {
        filterMenuIcon = hasDensityNext ? Dismiss : ControlIcons.Cancel;
    }
    return (
        <div
            ref={ref => (container.current = ref)}
            className={containerClassNames}
            onClick={onFilterClick}
            onKeyDown={onKeyDownOnFilter}
            {...generateDomPropertiesForAria(ariaProps)}
            tabIndex={0}>
            <div
                className={classNames(
                    styles.filterContents,
                    hasDensityNext && styles.filterContentsNext,
                    hasDensityNext && getDensityModeString()
                )}>
                {hasDensityNext && <Icon className={styles.filterIcon} iconName={Filter} />}
                {filterMenuText}
                <Icon
                    className={hasDensityNext ? styles.sortOrderIcon : styles.icon}
                    iconName={filterMenuIcon}
                />
            </div>
            {filterViewStore.filterContextMenuDisplayState && (
                <MailFilterContextMenu
                    currentViewFilter={currentSelectedFilter}
                    supportedViewFilters={props.supportedViewFilters}
                    dismissContextMenu={dismissContextMenu}
                    contextMenuTargetElement={container.current}
                    filterMenuSource={props.filterMenuSource}
                    tableViewId={props.tableViewId}
                />
            )}
        </div>
    );
});

function dismissContextMenu(): void {
    hideFilterDropDownContextMenu();
    // Reset focus when filter context menu is dismissed
    lazyResetFocus.importAndExecute();
}
