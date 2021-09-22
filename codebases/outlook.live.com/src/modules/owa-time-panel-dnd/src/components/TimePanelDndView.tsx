import TimePanelEventDropHintContainer from './TimePanelEventDropHintContainer';
import TimePanelTaskDropHintContainer from './TimePanelTaskDropHintContainer';
import { getTimePanelDndPivotTabId } from '../utils/getTimePanelDndPivotTabId';
import { observer } from 'mobx-react-lite';
import { assertNever } from 'owa-assert';
import { DraggableItemTypes } from 'owa-dnd';
import { ConditionalDropHint } from 'owa-drophint-views';
import { getCurrentPanelViewType, isSupportedViewForUser } from 'owa-time-panel-settings';
import * as React from 'react';
import {
    getTimePanelDropState,
    isTimePanelDndViewEnabled,
} from '../selectors/timePanelDndStoreSelectors';

interface TimePanelDndViewProps {
    children?: React.ReactNode;
}

import styles from './TimePanelDndView.scss';

// shift pivot to account for whitespace in header bar up to position beak tip closer to pivots
const pivotAdjustmentX = -12;

export default observer(function TimePanelDndView(props: TimePanelDndViewProps) {
    const { children } = props;

    if (!isTimePanelDndViewEnabled()) {
        return <>{children}</>;
    }

    const isToDoAvailable = isSupportedViewForUser('Tasks');
    const panelViewType = getCurrentPanelViewType();
    let content: JSX.Element = null;
    switch (panelViewType) {
        case 'Calendar':
            content = (
                <div className={styles.dndContainer}>
                    {isToDoAvailable && (
                        <TimePanelTaskDropHintContainer
                            referenceElementId={getTimePanelDndPivotTabId('Tasks')}
                            beakAdjustmentX={pivotAdjustmentX}
                        />
                    )}
                    <TimePanelEventDropHintContainer
                        containerClassName={styles.primaryDropHintContainer}
                    />
                </div>
            );
            break;
        case 'Tasks':
            content = (
                <div className={styles.dndContainer}>
                    <TimePanelEventDropHintContainer
                        referenceElementId={getTimePanelDndPivotTabId('Calendar')}
                        beakAdjustmentX={pivotAdjustmentX}
                    />
                    {isToDoAvailable && (
                        <TimePanelTaskDropHintContainer
                            containerClassName={styles.primaryDropHintContainer}
                        />
                    )}
                </div>
            );
            break;
        default:
            assertNever(panelViewType);
    }

    return (
        <ConditionalDropHint
            dragItemType={DraggableItemTypes.MailListRow}
            dropViewState={getTimePanelDropState()}
            dropHintView={content}>
            {children}
        </ConditionalDropHint>
    );
});
