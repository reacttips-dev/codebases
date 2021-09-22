import { observer } from 'mobx-react-lite';
import MailView from './MailView';
import { logUsage } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import { GroupHeaderSettingsButtonClicked } from 'owa-group-common';
import { GroupFavoriteButton } from 'owa-group-favorite-button';
import { LazyGroupFilesHub, LazyGroupFilesHubSxSLayerView } from 'owa-group-files-hub-view';
import groupHeaderCommandBarStore from 'owa-group-header-store/lib/store/CommandBarStore';
import GroupHeaderNavigationButton from 'owa-group-header-store/lib/store/schema/NavigationButton';
import { GroupHeader, GroupHeaderV2 } from 'owa-group-header-view';
import { lazyOpenGroupSettings } from 'owa-group-settings-integration';
import { lazyIsJoinedGroup } from 'owa-group-utils';
import { getCurrentGroupInformationStore } from 'owa-groups-shared-store/lib/CurrentGroupInformationStore';
import { isConsumer } from 'owa-session-store';
import type { TabViewState } from 'owa-tab-store';
import * as React from 'react';
import { LazyFilesViewList } from 'owa-files-view';

import commonStyles from './MailModule.scss';
import styles from './GroupView.scss';

export interface Props {
    activeTab: TabViewState;
    isDumpsterOrDumpsterSearchTable: boolean;
}

export default observer(function GroupView(props: Props) {
    const renderSelectedGroupView = (): JSX.Element | null => {
        const currentView = groupHeaderCommandBarStore.navigationButtonSelected;
        switch (currentView) {
            case GroupHeaderNavigationButton.Email:
                return <MailView {...props} />;
            case GroupHeaderNavigationButton.Files:
                return isConsumer() ? (
                    <div className={styles.wrapper}>
                        <LazyFilesViewList />
                    </div>
                ) : (
                    <div className={styles.wrapper}>
                        <LazyGroupFilesHub className={styles.fileshub} />
                        <LazyGroupFilesHubSxSLayerView />
                    </div>
                );
                break;
            // TODO: add all other cases here
        }
        return null;
    };
    return (
        <div className={commonStyles.rightPane}>
            {renderGroupHeader()}
            {renderSelectedGroupView()}
        </div>
    );
});

async function openGroupSettings(groupId: string) {
    logUsage(GroupHeaderSettingsButtonClicked);
    const openGroupSettings = await lazyOpenGroupSettings.import();
    openGroupSettings(groupId);
}

function renderGroupHeader(): JSX.Element | null {
    if (isFeatureEnabled('grp-groupHeaderV2')) {
        const currentView = groupHeaderCommandBarStore.navigationButtonSelected;
        if (currentView == GroupHeaderNavigationButton.Email) {
            return null;
        }
        const groupId = getCurrentGroupInformationStore().smtpAddress;
        return <GroupHeaderV2 groupId={groupId} />;
    }
    let renderFavoriteButton = isFeatureEnabled('tri-favorites-roaming')
        ? (groupId: string) => {
              const isJoinedGroup = lazyIsJoinedGroup.tryImportForRender();
              return isJoinedGroup?.(groupId) ? (
                  <GroupFavoriteButton
                      iconStyles={styles.favoriteButtonInHeader}
                      groupId={groupId}
                  />
              ) : (
                  <div></div>
              );
          }
        : undefined;
    return (
        <div className={styles.groupHeaderOuter}>
            <GroupHeader
                renderFavoriteButton={renderFavoriteButton}
                openGroupSettings={openGroupSettings}
            />
        </div>
    );
}
