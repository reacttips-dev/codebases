import { commandToolbarLabel } from '../strings.locstring.json';
import loc from 'owa-localize';
import MailCommandBarView from './MailCommandBarView';
import groupHeaderCommandBarStore from 'owa-group-header-store/lib/store/CommandBarStore';
import GroupHeaderNavigationButton from 'owa-group-header-store/lib/store/schema/NavigationButton';
import { LazyGroupFilesHubCommandBar } from 'owa-group-files-hub-view';
import type { TabViewState } from 'owa-tab-store';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { isConsumer } from 'owa-session-store';
import { LazyFilesViewCommandBar } from 'owa-files-view';

import styles from './MailModule.scss';

export interface GroupCommandBarViewProps {
    activeTab: TabViewState;
    isDumpsterOrDumpsterSearchTable: boolean;
    shouldShowPublicFolderView: boolean;
}

const GroupCommandBarView = observer(function GroupCommandBarView(props: GroupCommandBarViewProps) {
    const currentView = groupHeaderCommandBarStore.navigationButtonSelected;

    let content: JSX.Element | null = null;
    switch (currentView) {
        case GroupHeaderNavigationButton.Email:
            return <MailCommandBarView isInGroupsView={true} {...props} />;
        case GroupHeaderNavigationButton.Files:
            content = isConsumer() ? <LazyFilesViewCommandBar /> : <LazyGroupFilesHubCommandBar />;
            break;
        // TODO: add all other cases here
    }

    return (
        <div
            tabIndex={-1}
            className={styles.commandBar}
            role={'region'}
            aria-label={loc(commandToolbarLabel)}>
            {content}
        </div>
    );
});
export default GroupCommandBarView;
