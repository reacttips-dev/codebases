import { observer } from 'mobx-react-lite';
import { FullCompose } from 'owa-mail-compose-view';
import { messageAdListViewStatusStore } from 'owa-mail-messagead-list-store';
import { MessageAdReadingPane } from 'owa-mail-messagead-readingpane-view';
import { ReadingPane } from 'owa-mail-reading-pane-view';
import { getActiveContentTab, TabType, TabViewState } from 'owa-tab-store';
import { READING_PANE_CONTAINER_ID } from '../constants';
import * as React from 'react';
import * as trace from 'owa-trace';

import { composeStore } from 'owa-mail-compose-store';

export interface ReadingPaneContainerProps {
    isDumpsterOrDumpsterSearchTable?: boolean;
    suppressServerMarkReadOnReplyOrForward?: boolean;
    isNotesFolder?: boolean;
    isItemAttachment?: boolean;
}

import styles from './ReadingPaneContainer.scss';
export default observer(function ReadingPaneContainer(props: ReadingPaneContainerProps) {
    const renderReadingPane = (): JSX.Element => {
        let renderContent = null;
        const activeTab = getActiveContentTab();
        // If in dumpster or dumpster search, should always show reading pane (no compose)
        if (props.isDumpsterOrDumpsterSearchTable) {
            renderContent = (
                <ReadingPane
                    isDumpsterOrDumpsterSearchTable={props.isDumpsterOrDumpsterSearchTable}
                    isNotesFolder={props.isNotesFolder}
                    isFromMainWindow={true}
                    isItemAttachment={props.isItemAttachment}
                />
            );
        } else {
            const primaryComposeViewState =
                composeStore.primaryComposeId &&
                composeStore.viewStates.get(composeStore.primaryComposeId);
            // Priority for content to be loaded into the Reading Pane:
            // 1. If a message ad has been clicked.
            // 2. If we're in tab view and have an activate tab matching these types.
            // 3. If a full compose is open.
            // 4. Render the base reading pane out of the store.
            if (messageAdListViewStatusStore.selectedAdId) {
                renderContent = (
                    <MessageAdReadingPane
                        selectedAdRowId={messageAdListViewStatusStore.selectedAdId}
                    />
                );
            } else if (
                activeTab &&
                (activeTab.type == TabType.MailCompose ||
                    activeTab.type == TabType.SecondaryReadingPane)
            ) {
                // TODO: render all types of tab using this.renderTabContent()
                renderContent = renderTabContent(activeTab);
            } else if (primaryComposeViewState && !primaryComposeViewState.isInlineCompose) {
                renderContent = (
                    <FullCompose
                        viewState={primaryComposeViewState}
                        key={primaryComposeViewState.composeId}
                        isFromMainWindow={true}
                    />
                );
            } else {
                renderContent = (
                    <ReadingPane
                        isDumpsterOrDumpsterSearchTable={props.isDumpsterOrDumpsterSearchTable}
                        isNotesFolder={props.isNotesFolder}
                        isFromMainWindow={true}
                        isItemAttachment={props.isItemAttachment}
                    />
                );
            }
        }
        return <div key="renderReadingPaneDiv">{renderContent}</div>;
    };
    const renderTabContent = (tab: TabViewState) => {
        let content: JSX.Element = null;
        switch (tab.type) {
            case TabType.MailCompose:
                const composeViewState = composeStore.viewStates.get(tab.data);
                if (composeViewState) {
                    content = (
                        <FullCompose
                            key={composeViewState.composeId}
                            viewState={composeViewState}
                            isFromMainWindow={true}
                        />
                    );
                } else {
                    // for some reason, we are trying to render a tab, but we weren't able to grab any data about that tab.
                    // Tracing here with some info that might help us diagnose.
                    let keyList = '';
                    composeStore.viewStates.forEach((value, key) => {
                        keyList = keyList + key + ' : ';
                    });
                    trace.errorThatWillCauseAlert(
                        '[ReadingPaneContainer] Attempted to render compose tab ID ' +
                            tab.data +
                            ' but it was not present in the compose store. Compose store IDs are ' +
                            keyList
                    );
                }
                break;
            case TabType.SecondaryReadingPane:
                content = (
                    <ReadingPane
                        isDumpsterOrDumpsterSearchTable={props.isDumpsterOrDumpsterSearchTable}
                        isNotesFolder={props.isNotesFolder}
                        isFromMainWindow={true}
                        isItemAttachment={props.isItemAttachment}
                    />
                );
                break;
        }
        return content;
    };
    return (
        <div
            className={styles.showTabBar}
            key="readingPaneContainerDiv"
            id={READING_PANE_CONTAINER_ID}>
            {renderReadingPane()}
        </div>
    );
});
