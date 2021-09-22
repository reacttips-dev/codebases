import { observer } from 'mobx-react-lite';
import { isFeatureEnabled } from 'owa-feature-flags';
import { IsChildConsumerUser, IsShadowMailboxUser } from 'owa-mail-ads-shared/lib/sharedAdsUtils';
import selectDefaultFolder from 'owa-mail-folder-forest-actions/lib/actions/selectDefaultFolder';
import { FolderPane } from 'owa-mail-folder-forest-view';
import { LeftnavUpsell } from 'owa-mail-leftnavupsell';
import { LeftnavStorageNotification } from 'owa-mail-leftnav-storage-notification';
import { ModuleSwitcher } from 'owa-module-switcher';
import { Module } from 'owa-workloads';
import { getCurrentCulture } from 'owa-localize';
import * as React from 'react';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { lazyGetStorageStore } from 'owa-storage-store';
import { MeetNowFolderPaneButton, lazyIsMeetNowEnabled } from 'owa-meet-now';

interface FolderPaneContainerProps {
    isLeftRailVisible: boolean;
    leftNavWidth: number;
}

import styles from './MailModule.scss';

export default observer(function FolderPaneContainer(props: FolderPaneContainerProps) {
    const getStorageStore = lazyGetStorageStore.tryImportForRender();
    const usagePercentage = getStorageStore ? getStorageStore().usagePercentage : 0;

    // Value deciding whether to show the storage notification
    const showStorageNotification = usagePercentage >= 90;

    const showLeftNavPremiumUpsell =
        isConsumer() &&
        !IsShadowMailboxUser() &&
        isFeatureEnabled('auth-leftNavPremiumUpsell') &&
        !IsChildConsumerUser() &&
        getCurrentCulture().indexOf('jp') === -1 &&
        !showStorageNotification;

    const showMeetNowButton =
        isFeatureEnabled('fwk-meetNowButtonModuleSwitcher') &&
        lazyIsMeetNowEnabled.tryImportForRender()?.();

    return (
        <div className={styles.leftColumn}>
            <FolderPane />
            {showStorageNotification && (
                <LeftnavStorageNotification usagePercentage={usagePercentage} />
            )}
            {showLeftNavPremiumUpsell && <LeftnavUpsell />}
            {!props.isLeftRailVisible && !isFeatureEnabled('tri-officeRail') && (
                <>
                    {showMeetNowButton && <MeetNowFolderPaneButton />}
                    <ModuleSwitcher
                        selectedModule={Module.Mail}
                        activeModuleAction={onModuleClicked}
                        containerWidth={props.leftNavWidth}
                    />
                </>
            )}
        </div>
    );
});

function onModuleClicked() {
    selectDefaultFolder('ModuleSwitcher');
}
