import { observer } from 'mobx-react-lite';
import { commandToolbarLabel, ribbonLabel } from '../strings.locstring.json';
import loc from 'owa-localize';
import { ComposeCommandingBar } from 'owa-mail-compose-view';
import { MailCommandingBar } from 'owa-mail-commandbar';
import { SecondaryReadingPaneTabCommandingBar } from 'owa-mail-reading-pane-view';
import { listViewStore } from 'owa-mail-list-store';
import { TabViewState, TabType } from 'owa-tab-store';
import getFullComposeShowingInTabContentArea from 'owa-mail-compose-actions/lib/selectors/getFullComposeShowingInTabContentArea';
import * as React from 'react';
import {
    isReadingPanePositionOff,
    isReadingPanePositionRight,
    getListViewDimensions,
    shouldShowFolderPaneAsOverlay,
    shouldShowFolderPane,
    getLeftNavWidth,
} from 'owa-mail-layout';
import { shouldShowCommandBarHamburgerButton } from 'owa-mail-filterable-menu-behavior';
import LeftPaneHamburgerButton from 'owa-mail-commandbar/lib/components/LeftPaneHamburgerButton';
import { ThemeProvider, PartialTheme } from '@fluentui/react';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';
import { getCommandBarTheme } from 'owa-mail-densities/lib/utils/getCommandBarTheme';
import { getInRibbonMode, getIsViewModeSelected } from 'owa-command-ribbon-store';
import { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';
import MailNewMessageButton from './MailNewMessageButton';
import { useStrategy } from 'owa-strategies';

import styles from './MailModule.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailCommandBarViewProps {
    activeTab: TabViewState;
    isDumpsterOrDumpsterSearchTable: boolean;
    leftPadding?: number;
    isInGroupsView?: boolean;
    shouldShowPublicFolderView?: boolean;
}

export default observer(function MailCommandBarView(props: MailCommandBarViewProps) {
    const { activeTab, isDumpsterOrDumpsterSearchTable } = props;
    const activeFullComposeViewState = getFullComposeShowingInTabContentArea();
    const isShowingComposeCommandingBar =
        !isDumpsterOrDumpsterSearchTable &&
        /* Should never show compose command bar if in dumpster */ activeFullComposeViewState;
    const isShowingSecondaryReadingPane =
        activeTab && activeTab.type == TabType.SecondaryReadingPane;

    const densityModeString = getDensityModeString();
    const hasCollapsiblePane = isFeatureEnabled('mon-tri-collapsibleFolderPane');
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const isShowingFolderPane = shouldShowFolderPane();
    const [newMsgBtnWidth, setNewMsgBtnWidth] = React.useState(0);
    const newMsgBtnRef = React.useCallback((ref: HTMLDivElement) => {
        // when the ref changes within custom items update the size of the new message button
        if (ref !== null) {
            setNewMsgBtnWidth(ref.getClientRects()[0].width);
        }
    }, []);
    const renderCommandBar = () => {
        const { isInGroupsView, shouldShowPublicFolderView } = props;

        const shouldShowComposeHamburgerButton = shouldShowCommandBarHamburgerButton();
        let commandBarPadding;
        const showFolderPaneAsOverlay = shouldShowFolderPaneAsOverlay();
        const showNewMessageButton =
            hasCollapsiblePane || hasDensityNext || !isShowingFolderPane || showFolderPaneAsOverlay;
        let renderCommandBarCustomItem =
            shouldShowComposeHamburgerButton || hasCollapsiblePane
                ? () => (
                      <div className={classNames(styles.commandBarCustomItem)}>
                          {!hasCollapsiblePane && (
                              <LeftPaneHamburgerButton
                                  isPaneExpanded={isShowingFolderPane && showFolderPaneAsOverlay}
                              />
                          )}
                          {showNewMessageButton && (
                              <MailNewMessageButton
                                  isInGroupsView={!!isInGroupsView}
                                  shouldShowPublicFolderView={!!shouldShowPublicFolderView}
                                  newMsgBtnRef={newMsgBtnRef}
                              />
                          )}
                      </div>
                  )
                : undefined;

        const hamburgerButtonWidth = hasCollapsiblePane ? 0 : 48;
        const collapseiblePaneWidth = hasCollapsiblePane ? 40 : 0;

        const closeCommandBarPadding = getLeftNavWidth() - newMsgBtnWidth;
        if (activeFullComposeViewState) {
            // The hamburger button is rendered in the compose command bar when the officeRail flight is on
            // Since the button is 48px, we need less padding than the case where it's just the compose actions
            // The closer commandbar goes on top of the left and right panes. The left padding is mail list + left nav - hamburger
            if (isReadingPanePositionRight()) {
                if (!isShowingFolderPane) {
                    commandBarPadding =
                        getListViewDimensions().listViewWidth -
                        newMsgBtnWidth -
                        hamburgerButtonWidth +
                        collapseiblePaneWidth;
                } else if (shouldShowComposeHamburgerButton || hasCollapsiblePane) {
                    commandBarPadding =
                        getListViewDimensions().listViewWidth +
                        (hasDensityNext || hasCollapsiblePane ? closeCommandBarPadding : 0) -
                        hamburgerButtonWidth;
                } else {
                    commandBarPadding = getListViewDimensions().listViewWidth;
                }
            } else {
                commandBarPadding = hasDensityNext
                    ? closeCommandBarPadding - hamburgerButtonWidth
                    : 0;
            }
        }

        if (isShowingComposeCommandingBar) {
            return (
                <ComposeCommandingBar
                    composeViewState={activeFullComposeViewState}
                    leftPadding={commandBarPadding}
                    renderCustomItem={renderCommandBarCustomItem}
                />
            );
        }
        if (isShowingSecondaryReadingPane) {
            return (
                <SecondaryReadingPaneTabCommandingBar
                    tab={activeTab}
                    readingPaneOff={isReadingPanePositionOff()}
                    renderCustomItem={renderCommandBarCustomItem}
                />
            );
        }
        return <MailCommandingBar tableViewId={listViewStore.selectedTableViewId} />;
    };
    let commandBarTheme: PartialTheme | {} = {};

    if (hasDensityNext) {
        commandBarTheme = getCommandBarTheme(densityModeString);
    }

    const Ribbon = useStrategy('ribbon');
    const inRibbonMode = Ribbon && getInRibbonMode();

    // Special case for secondary reading pane:
    // MailRibbon doesn't currently handle this scenario so we're falling back to
    // the toolbar-based solution, SecondaryReadingPaneTabCommandingBar will be rendered.
    // Also note that in this edge-case the heightStyle will be calculated for the active
    // ribbonMode, to prevent a layout shift caused by commanding height change.
    const isShowingRibbon = inRibbonMode && !isShowingSecondaryReadingPane;

    let heightStyle: string | undefined = undefined;
    if (inRibbonMode) {
        if (getIsViewModeSelected(CommandingViewMode.SingleLineRibbon)) {
            heightStyle = styles.ribbonBarSingleLine;
        } else {
            heightStyle = styles.ribbonBarMultiline;
        }
    } else if (!hasDensityNext) {
        heightStyle = styles.originalHeight;
    }

    return (
        <ThemeProvider theme={commandBarTheme}>
            <div
                tabIndex={-1}
                className={classNames(styles.commandBar, heightStyle)}
                role={'region'}
                aria-label={loc(inRibbonMode ? ribbonLabel : commandToolbarLabel)}>
                {Ribbon && isShowingRibbon ? <Ribbon /> : renderCommandBar()}
            </div>
        </ThemeProvider>
    );
});
