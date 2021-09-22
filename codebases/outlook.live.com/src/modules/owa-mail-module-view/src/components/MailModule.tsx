/* tslint:disable:jsx-no-lambda WI:47690 */
import * as React from 'react';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import Droppable from 'owa-dnd/lib/components/Droppable';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import MailCommandBarView from './MailCommandBarView';
import MailLeftPane from './MailLeftPane';
import MailView from './MailView';
import setTypeOfItemBeingDragged from 'owa-mail-store/lib/actions/setTypeOfItemBeingDragged';
import store from 'owa-mail-store/lib/store/Store';
import { AdsPanelStub } from 'owa-mail-ads-stub';
import type { SearchBoxContainerHandle } from 'owa-search';
import { getActiveContentTab, TabViewState } from 'owa-tab-store';
import { isGroupSelected } from 'owa-group-utils';
import { ImmersiveReaderContainer } from 'owa-immersive-reader';
import { isAppPaneUnderlayExpanded } from 'owa-application';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isDumpsterSearchTable } from 'owa-mail-list-search';
import { isDumpsterTable, listViewStore } from 'owa-mail-list-store';
import { isGroupsEnabled } from 'owa-account-capabilities/lib/isGroupsEnabled';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyTriggerResizeEvent } from 'owa-resize-event';
import { LightningId } from 'owa-lightning-core-v2/lib/LightningId';
import { MailQuickSwitcher } from 'owa-mail-quick-switcher';
import { observer } from 'mobx-react-lite';
import { hasQueryStringParameter } from 'owa-querystring';
import { PremiumDomainConnectFirstStepLightable } from 'owa-domain-connect/lib/lazyFunctions';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { ResizeHandle } from 'owa-resize-handle';
import {
    lazyLeftPaneResized,
    getRightPaneStyles,
    shouldShowFolderPaneAsOverlay,
    shouldShowFolderPane,
} from 'owa-mail-layout';
import { PrivateDistributionlistModalEditor } from 'owa-favorite-pdl-editor';
import { isPublicFolderSelected } from 'owa-publicfolder-utils';
import { setDraggedItemType as setDraggedItemTypeInModule } from 'owa-module-dnd-store';
import { LazyAnnounced } from 'owa-controls-announced';
import { useLazyKeydownHandler } from 'owa-hotkeys';
import { lazySetupMailModuleKeys, GroupView, GroupCommandBarView } from './lazy/lazyFunctions';
import { useDragHelpers } from './hooks/useDragHelpers';
import { TopUpsellBannerComponent } from 'owa-upsell-components-placeholder';
import { Module } from 'owa-workloads';
import { initializeMailFavicon } from 'owa-mail-favicon';
import { isPremiumConsumer } from 'owa-session-store';
import isOfficeRailEnabled from 'owa-left-rail-utils/lib/isOfficeRailEnabled';
import { getInRibbonMode } from 'owa-command-ribbon-store';
import FolderPaneToggleButton from 'owa-mail-folder-forest-view/lib/components/FolderPaneToggleButton';
import { LEFT_RAIL_STATIC_WIDTH } from 'owa-layout';

import styles from './MailModule.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

// Replace this with an interface when we have real props
// For now leaving it as named so that the generic DragDropContext
// has a named type to use
export interface MailModuleProps {
    searchBoxRef: React.RefObject<SearchBoxContainerHandle>;
}

export interface CommonMailViewProps {
    activeTab: TabViewState;
    isDumpsterOrDumpsterSearchTable: boolean;
}

export default observer(function MailModule(props: MailModuleProps) {
    useLazyKeydownHandler(undefined, lazySetupMailModuleKeys.importAndExecute, props.searchBoxRef);
    initializeMailFavicon();
    const dragHelpers = useDragHelpers(setDataItemType);

    React.useEffect(() => {
        // Set initial focus after component is mounted
        lazyResetFocus.importAndExecute();
    }, []);

    const emptyDropViewState = createDropViewState();
    const shouldShowAds = isConsumer() && isFeatureEnabled('fwk-ads');
    const showOfficeRail = isFeatureEnabled('tri-officeRail');
    const hideLeftPane = showOfficeRail && !shouldShowFolderPane();
    const tableQuery = listViewStore.tableViews.get(listViewStore.selectedTableViewId)?.tableQuery;
    const isDumpsterOrDumpsterSearchTable =
        isDumpsterTable(tableQuery) || isDumpsterSearchTable(tableQuery);
    const activeTab = getActiveContentTab();
    const commonMailViewProps = {
        activeTab,
        isDumpsterOrDumpsterSearchTable,
    };
    const isGroupsView = isInGroupsView();

    const hasCloseCommandBar =
        isFeatureEnabled('mon-tri-collapsibleFolderPane') ||
        isFeatureEnabled('mon-densities') ||
        getInRibbonMode();
    const shouldShowPublicFolderView = isPublicFolderSelected();
    const commandBar = renderCommandBar(
        isGroupsView,
        commonMailViewProps,
        shouldShowPublicFolderView
    );

    return (
        <>
            {isFeatureEnabled('cmp-quickSwitcher') && <MailQuickSwitcher />}
            <Droppable
                classNames={styles.mailMain}
                {...dragHelpers}
                dropViewState={emptyDropViewState}
                shouldIgnoreTransientOnDragLeave={true}
                bypassActOnDrop={true}>
                {<TopUpsellBannerComponent />}
                <div className={styles.allPaneContainer}>
                    <div className={styles.innerPaneContent}>
                        {hasCloseCommandBar && commandBar}
                        <div className={styles.panes}>
                            {isFeatureEnabled('mon-tri-collapsibleFolderPane') && hideLeftPane && (
                                <div className={styles.collapsedNav}>
                                    <FolderPaneToggleButton />
                                </div>
                            )}
                            {!hideLeftPane && (
                                <MailLeftPane
                                    isInGroupsView={isInGroupsView()}
                                    shouldShowPublicFolderView={shouldShowPublicFolderView}
                                    hideLeftRail={showOfficeRail}
                                />
                            )}
                            {
                                // Add resize handler only when folder pane is not shown as an overlay
                                !shouldShowFolderPaneAsOverlay() && (
                                    <ResizeHandle
                                        className={styles.leftResizeHandler}
                                        onResize={leftNavResizeHandler}
                                    />
                                )
                            }
                            {renderRightPane(
                                isGroupsView,
                                hasCloseCommandBar,
                                commandBar,
                                commonMailViewProps
                            )}
                            {shouldShowAds && (
                                <AdsPanelStub
                                    isBottom={false}
                                    isHidden={isAppPaneUnderlayExpanded()}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {shouldShowAds && <AdsPanelStub isBottom={true} />}
            </Droppable>
            {isFeatureEnabled('rp-immersiveReader') && <ImmersiveReaderContainer />}
            {isFeatureEnabled('peo-favoritePdls') && <PrivateDistributionlistModalEditor />}
            {ShowDomainConnectFirstStep() && (
                <PremiumDomainConnectFirstStepLightable
                    lid={LightningId.PremiumDomainConnectModal}
                    when={lightup => lightup()}
                />
            )}
            <LazyAnnounced
                aria-live={store.triageAnnouncement.politenessSetting}
                message={store.triageAnnouncement.message}
            />
        </>
    );
});

function isInGroupsView() {
    return isGroupsEnabled() && isGroupSelected();
}

/**
 * An onResize callback used to update the user config with the new value for folder list's width.
 * @param fullLeftNavWidth - the measured width from the left of the screen to the resize handle
 */
async function leftNavResizeHandler(fullLeftNavWidth: number) {
    const leftPaneResized = await lazyLeftPaneResized.import();
    if (isOfficeRailEnabled(Module.Mail)) {
        fullLeftNavWidth += LEFT_RAIL_STATIC_WIDTH;
    }
    leftPaneResized(fullLeftNavWidth);
    lazyTriggerResizeEvent.importAndExecute();
}

function setDataItemType(newValue: string | null) {
    if (store.typeOfItemBeingDragged != newValue) {
        setTypeOfItemBeingDragged(newValue);
        setDraggedItemTypeInModule(newValue);
    }
}

function ShowDomainConnectFirstStep(): boolean {
    // The test hook query string parameter has the domain name
    const sessionSettings = getUserConfiguration().SessionSettings;
    return !!(
        isFeatureEnabled('auth-domainConnectDemandGen') &&
        (hasQueryStringParameter('testhook') ||
            (isPremiumConsumer() &&
                sessionSettings?.PremiumAccountOffers &&
                (sessionSettings.PremiumAccountOffers & 2) != 2 &&
                !sessionSettings?.IsProsumerConsumerMailbox))
    );
}

function renderRightPane(
    isGroupsView: boolean | undefined,
    hasCloseCommandBar: boolean,
    commandBar: JSX.Element,
    commonMailViewProps: CommonMailViewProps
): JSX.Element {
    return (
        <div
            // This value is given so that the resize handler does not automatically calculate max for this div
            // Else the max is calculated as window width - the max of left pane which may lead to not being
            // able to resize the left pane when both left and right divs reach their max widths.
            data-max-width={2400}
            className={classNames(styles.rightPaneContainer, getRightPaneStyles())}>
            {!hasCloseCommandBar && commandBar}
            {isGroupsView ? (
                <>
                    <GroupView {...commonMailViewProps} />
                </>
            ) : (
                <>
                    <MailView {...commonMailViewProps} />
                </>
            )}
        </div>
    );
}

function renderCommandBar(
    isInGroupsView: boolean | undefined,
    commonMailViewProps: CommonMailViewProps,
    shouldShowPublicFolderView: boolean
): JSX.Element {
    if (isInGroupsView) {
        return (
            <GroupCommandBarView
                shouldShowPublicFolderView={shouldShowPublicFolderView}
                {...commonMailViewProps}
            />
        );
    }
    return (
        <MailCommandBarView
            shouldShowPublicFolderView={shouldShowPublicFolderView}
            {...commonMailViewProps}
        />
    );
}
