import Rollup from './Rollup';
import onFocusedOtherRollupClicked from '../utils/onFocusedOtherRollupClicked';
import shouldShowFocusedRollup from '../utils/shouldShowFocusedRollup';
import shouldShowRollup from '../utils/shouldShowRollup';
import { observer } from 'mobx-react-lite';
import type { TableView } from 'owa-mail-list-store';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import * as React from 'react';
import {
    focusedInboxRollupStore,
    getRollupText,
    updateWatermarksAndResetRollup,
} from 'owa-mail-focused-inbox-rollup-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';
import styles from './RollupContainer.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface RollupContainerProps {
    currentRowKey: string;
    focusedViewFilter: FocusedViewFilter;
    folderId: string;
    previousRowKey: string;
    styleSelectorAsPerUserSettings: string;
    tableView: TableView;
}

export default observer(function RollupContainer(props: RollupContainerProps) {
    const {
        currentRowKey,
        focusedViewFilter,
        folderId,
        previousRowKey,
        styleSelectorAsPerUserSettings,
        tableView,
    } = props;

    const onFocusedOtherRollupDismissed = React.useCallback(() => {
        updateWatermarksAndResetRollup(focusedViewFilter, 'ExitRollupButton');
    }, [focusedViewFilter]);

    // Check if we should show any rollup. If not, just early return.
    if (!shouldShowRollup(previousRowKey, currentRowKey, folderId)) {
        return null;
    }

    const textStyle =
        isFeatureEnabled('mon-densities') && classNames(styles.rollupText, getDensityModeString());

    // Only evaluate if we determine either F/O rollup should be shown.
    let showFocusedRollup = false;
    let showOtherRollup = false;
    if (shouldShowFocusedRollup()) {
        // Show if we're in Other pivot.
        showFocusedRollup = focusedViewFilter == FocusedViewFilter.Other;

        // Show if we're in Focused pivot.
        showOtherRollup = focusedViewFilter == FocusedViewFilter.Focused;
    }

    if (showFocusedRollup || showOtherRollup) {
        return (
            <Rollup
                onClick={onFocusedOtherRollupClicked}
                onDismissed={onFocusedOtherRollupDismissed}
                primaryText={getRollupText(focusedInboxRollupStore.viewType, folderId)}
                secondaryText={focusedInboxRollupStore.uniqueSenders}
                styleSelectorAsPerUserSettings={styleSelectorAsPerUserSettings}
                styles={{
                    containerClassName: styles.focusedOtherRollupContainer,
                    dismissButtonClassName: styles.focusedOtherDismissButton,
                    primaryTextClassName: classNames(styles.focusedOtherPrimaryText, textStyle),
                    secondaryTextClassName: classNames(styles.focusedOtherSecondaryText, textStyle),
                }}
                tableView={tableView}
            />
        );
    }

    return null;
});
