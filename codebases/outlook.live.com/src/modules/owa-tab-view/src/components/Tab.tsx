import { observer } from 'mobx-react-lite';
import * as React from 'react';
import activateTab from 'owa-tab-store/lib/actions/activateTab';
import MailListTab from './MailListTab';
import OverflowTab from './OverflowTab';
import PrimaryReadingPaneTab from './PrimaryReadingPaneTab';
import FloatingChatTab from './FloatingChatTab';
import SecondaryReadingPaneTab from './SecondaryReadingPaneTab';
import TabViewState, { TabType, TabState } from 'owa-tab-store/lib/store/schema/TabViewState';
import TimedDragTarget from './TimedDragTarget';
import { ComposeTab } from 'owa-mail-compose-view';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import { shouldShowReadingPane } from 'owa-mail-layout/lib/selectors/shouldShowReadingPane';

import styles from './TabBar.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

/**
 * Time before switching to this tab when the tab is dragged over
 */
const TAB_SWITCH_DRAGOVER_TIMEOUT_MS = 250;

export interface TabProps {
    viewState: TabViewState;
}

export default observer(function Tab(props_0: TabProps) {
    const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // ie11 reports .key as Spacebar for space, other browsers do ' '
        if (event.key == 'Spacebar' || event.key == 'Enter' || event.key == ' ') {
            activateThisTab();
        }
    };
    const activateThisTab = () => {
        if (props_0.viewState.type != TabType.OverflowMenu) {
            activateTab(props_0.viewState, true /*isUserAction*/);
        }
    };
    const viewState = props_0.viewState;
    const { state, blink, type } = viewState;
    let content: JSX.Element = null;
    const props = {
        className: styles.tabContent,
        subjectClassName: styles.subject,
    };
    switch (viewState.type) {
        case TabType.OverflowMenu:
            content = <OverflowTab {...{ ...props, viewState }} />;
            break;
        case TabType.FloatingChat:
            content = <FloatingChatTab {...{ ...props, viewState }} />;
            break;
        case TabType.MailCompose:
            content = <ComposeTab {...{ ...props, viewState }} />;
            break;
        case TabType.SecondaryReadingPane:
            content = <SecondaryReadingPaneTab {...{ ...props, viewState }} />;
            break;
        case TabType.Primary:
            const showPrimaryAsListView = isReadingPanePositionOff() && !shouldShowReadingPane();
            content = showPrimaryAsListView ? (
                <MailListTab {...{ ...props, viewState }} />
            ) : (
                <PrimaryReadingPaneTab {...{ ...props, viewState }} />
            );
            break;
    }
    const className = classNames(styles.tab, {
        active: state == TabState.Active,
        blink: blink,
        isChatTab: type == TabType.FloatingChat,
    });
    return (
        <TimedDragTarget
            tabIndex={0} //makes tabs... tabbable.
            className={className}
            dragTimeoutMs={TAB_SWITCH_DRAGOVER_TIMEOUT_MS}
            onKeyPress={onKeyPress}
            onClick={activateThisTab}
            onDragTimeout={activateThisTab}
            role={'button'}
            showDragIndicatorArrow={true}>
            {content}
        </TimedDragTarget>
    );
});
