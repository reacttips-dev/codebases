import { useAutoFocusRef } from './useAutoFocusRef';
import { useEscapeKeyHandler } from './useEscapeKeyHandler';
import { updateCurrentView } from '../actions/timePanelStoreActions';
import { ActionButton } from '@fluentui/react/lib/Button';
import { PivotItem, PivotLinkSize } from '@fluentui/react/lib/Pivot';
import { observer } from 'mobx-react-lite';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { backButtonText } from 'owa-locstrings/lib/strings/backbuttontext.locstring.json';
import { popView } from 'owa-time-panel-bootstrap';
import { closeComposeFormInTimePanel } from 'owa-time-panel-compose';
import { TimePanelDndPivot, TimePanelDropListener } from 'owa-time-panel-dnd';
import * as React from 'react';
import TimePanelHeaderButtonWell from './TimePanelHeaderButtonWell';
import {
    getCurrentPanelViewType,
    getStackLength,
    getCurrentPanelView,
    isSupportedViewForUser,
} from 'owa-time-panel-settings';
import {
    backButtonTitle,
    calendarPivotText,
    toDoPivotText,
} from './TimePanelHeaderBar.locstring.json';

import styles from './TimePanelHeaderBar.scss';

export interface TimePanelHeaderBarProps {
    onClosePanel: () => void;
}

export default observer(function TimePanelHeaderBar(props: TimePanelHeaderBarProps) {
    const { onClosePanel } = props;
    const { ref } = useAutoFocusRef();
    const currentPanelViewType = getCurrentPanelViewType();

    // If escape handling got to here, close the panel
    const onKeyDownCallback = useEscapeKeyHandler(onClosePanel);

    return (
        <TimePanelDropListener>
            <div ref={ref} className={styles.container} onKeyDown={onKeyDownCallback}>
                <div className={styles.headerControl}>
                    {getStackLength() > 1 ? (
                        <ActionButton
                            className={styles.backButton}
                            styles={{
                                icon: styles.backButtonIcon,
                            }}
                            text={loc(backButtonText)}
                            title={loc(backButtonTitle)}
                            onClick={backButtonClicked}
                            iconProps={{ iconName: ControlIcons.Back }}
                        />
                    ) : (
                        <TimePanelDndPivot
                            headersOnly={true}
                            onLinkClick={selectPivot}
                            linkSize={PivotLinkSize.normal}
                            selectedKey={currentPanelViewType}
                            styles={{ linkIsSelected: styles.pivotLinkSelected }}>
                            {isSupportedViewForUser('Calendar') && (
                                <PivotItem
                                    itemKey={'Calendar'}
                                    headerText={loc(calendarPivotText)}
                                />
                            )}
                            {isSupportedViewForUser('Tasks') && (
                                <PivotItem itemKey={'Tasks'} headerText={loc(toDoPivotText)} />
                            )}
                        </TimePanelDndPivot>
                    )}
                </div>
                <TimePanelHeaderButtonWell onClosePanel={onClosePanel} />
            </div>
        </TimePanelDropListener>
    );
});

function backButtonClicked(): void {
    if (getCurrentPanelView() === 'ComposeForm') {
        // If we have compose form opened, then we call closeComposeFormInTimePanel so that we show confirmation dialog if required.
        // closeComposeFormInTimePanel will take care of calling popView when it's done
        closeComposeFormInTimePanel();
    } else {
        popView();
    }
}

function selectPivot(item: PivotItem): void {
    switch (item.props.itemKey) {
        case 'Calendar':
            updateCurrentView('Calendar');
            break;
        case 'Tasks':
            updateCurrentView('Tasks');
            break;
        default:
            throw new Error('Not a valid ItemKey: ' + item.props.itemKey);
    }
}
