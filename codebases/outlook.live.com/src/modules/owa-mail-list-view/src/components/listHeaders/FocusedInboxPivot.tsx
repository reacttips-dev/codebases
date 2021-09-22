import { observer } from 'mobx-react-lite';
import { otherViewFilterText } from 'owa-locstrings/lib/strings/otherviewfiltertext.locstring.json';
import { focusedViewFilterText } from 'owa-locstrings/lib/strings/focusedviewfiltertext.locstring.json';
import {
    unseenMessageScreenReaderOnlyText,
    unseenMessagesScreenReaderOnlyText,
} from './unseenmessagesscreenreaderonlytext.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import Droppable from 'owa-dnd/lib/components/Droppable';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { selectFocusedViewFilter } from 'owa-mail-triage-table-utils';

import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { IPivotItemProps, Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import {
    getFocusedOtherDropViewState,
    getFocusedFilterForTable,
    listViewStore,
    isFolderPaused,
} from 'owa-mail-list-store';
import { focusedInboxRollupStore } from 'owa-mail-focused-inbox-rollup-store';
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider';
import { getInboxPivotTheme } from 'owa-mail-densities/lib/utils/getInboxPivotTheme';
import { getDensityModeString } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './InboxPivotStyles.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface FocusedInboxPivotProps {
    tableViewId: string;
    onDropFocused: (dragInfo: DragData) => void;
    onDropOther: (dragInfo: DragData) => void;
    onKeyDown: (ev: React.KeyboardEvent<HTMLElement>, tableViewId: string) => void;
    isSupportedItemTypeForDragDrop: boolean;
    shouldShowOnDropHoverTreatment: boolean;
    mailListHeaderStylesAsPerUserSettings: string;
}

export default observer(function FocusedInboxPivot(props: FocusedInboxPivotProps) {
    const tableView = listViewStore.tableViews.get(props.tableViewId);
    const unseenCount = isFolderPaused(tableView.tableQuery.folderId)
        ? null
        : focusedInboxRollupStore.unseenCountToDisplay;
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const densityModeString = getDensityModeString();

    const renderDroppablePivot = (
        link: IPivotItemProps,
        defaultRenderer: (link: IPivotItemProps) => JSX.Element,
        pivotKey: string,
        selectedPivotKey: string,
        onDrop: (dragInfo: DragData) => void,
        renderUnseenCountBadge: (selectedPivotKey: string, pivotKey: string) => JSX.Element
    ): JSX.Element => {
        const pivotStyles = classNames(
            styles.pivotItemContainer,
            pivotKey !== selectedPivotKey &&
                props.isSupportedItemTypeForDragDrop &&
                styles.dropContainer,
            props.shouldShowOnDropHoverTreatment && styles.dropHoverTreatment
        );
        return (
            <Droppable
                classNames={styles.pivotItem}
                dropViewState={getFocusedOtherDropViewState()}
                onDrop={onDrop}>
                <div className={pivotStyles}>
                    {defaultRenderer(link)}
                    {renderUnseenCountBadge(selectedPivotKey, pivotKey)}
                </div>
            </Droppable>
        );
    };
    const onPivotItemClicked = (item: PivotItem) => {
        const focusedViewFilterToSelect = convertPivotKeyToFocusedViewFilter(item.props.itemKey);
        selectFocusedViewFilter(focusedViewFilterToSelect, 'FocusedOtherPivot');
    };
    /**
     * Convert the focused view filter to a string that used as the key in Pivot fabric component
     * We need to do this instead of just using the FocusedViewFilter value, because FocusedViewFilter.None(-1) is ignored by the Fabric Pivot
     */
    const getKeyForSelectedFocusedViewFilter = (): string => {
        const tableView = listViewStore.tableViews.get(props.tableViewId);
        const focusedFilterForTable = getFocusedFilterForTable(tableView);
        let selectedKey = '';
        switch (focusedFilterForTable) {
            case FocusedViewFilter.None:
                selectedKey = 'inbox';
                break;
            case FocusedViewFilter.Focused:
                selectedKey = 'focused';
                break;
            case FocusedViewFilter.Other:
                selectedKey = 'other';
                break;
        }
        return selectedKey;
    };
    /**
     * Convert pivot key string back to the focused view filter to select
     * @param key of the pivot component
     */
    const convertPivotKeyToFocusedViewFilter = (key: string) => {
        switch (key) {
            case 'focused':
                return FocusedViewFilter.Focused;
            case 'other':
                return FocusedViewFilter.Other;
            default:
            case 'inbox':
                return FocusedViewFilter.None;
        }
    };
    const tryRenderUnseenCountBadge = React.useCallback(
        (selectedPivotKey: string, pivotKey: string): JSX.Element => {
            if (selectedPivotKey === pivotKey) {
                return null;
            }

            return unseenCount ? (
                <div
                    className={classNames(
                        styles.badgeContainer,
                        hasDensityNext && densityModeString
                    )}>
                    <p className={styles.unseenCount}>{unseenCount}</p>
                    <span className="screenReaderOnly">
                        {Number(unseenCount) == 1
                            ? loc(unseenMessageScreenReaderOnlyText)
                            : loc(unseenMessagesScreenReaderOnlyText)}
                    </span>
                </div>
            ) : null;
        },
        [unseenCount, densityModeString]
    );
    const onKeyDownHandler = React.useCallback(
        ev => {
            props.onKeyDown(ev, props.tableViewId);
        },
        [props]
    );
    const selectedKey = getKeyForSelectedFocusedViewFilter();
    const onRenderItemLinkFocusedHandler = React.useCallback(
        (link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element) =>
            renderDroppablePivot(
                link,
                defaultRenderer,
                'focused',
                selectedKey,
                props.onDropFocused,
                tryRenderUnseenCountBadge
            ),
        [props, selectedKey, tryRenderUnseenCountBadge]
    );
    const renderFocusedPivot = (): JSX.Element => {
        return (
            <PivotItem
                headerText={loc(focusedViewFilterText)}
                itemKey={'focused'}
                onRenderItemLink={onRenderItemLinkFocusedHandler}
            />
        );
    };
    const onRenderItemLinkOtherHandler = React.useCallback(
        (link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element) =>
            renderDroppablePivot(
                link,
                defaultRenderer,
                'other',
                selectedKey,
                props.onDropOther,
                tryRenderUnseenCountBadge
            ),
        [props, selectedKey, tryRenderUnseenCountBadge]
    );
    const renderOtherPivot = (): JSX.Element => {
        return (
            <PivotItem
                headerText={loc(otherViewFilterText)}
                itemKey={'other'}
                onRenderItemLink={onRenderItemLinkOtherHandler}
            />
        );
    };
    // Focused, Other
    return (
        <ThemeProvider
            applyTo="none"
            theme={getInboxPivotTheme(hasDensityNext && densityModeString)}>
            <div className={styles.pivotContainer} onKeyDown={onKeyDownHandler}>
                <Pivot
                    styles={{
                        link: classNames(
                            styles.nonSelectedPivotLink,
                            props.mailListHeaderStylesAsPerUserSettings
                        ),
                        linkIsSelected: classNames(
                            styles.selectedPivotLink,
                            props.mailListHeaderStylesAsPerUserSettings
                        ),
                        linkContent: styles.linkContent,
                        text: !hasDensityNext && styles.text,
                    }}
                    selectedKey={`${selectedKey}`}
                    onLinkClick={onPivotItemClicked}>
                    {renderFocusedPivot()}
                    {renderOtherPivot()}
                </Pivot>
            </div>
        </ThemeProvider>
    );
});
