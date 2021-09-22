import { observer } from 'mobx-react-lite';
/* tslint:disable:jsx-no-lambda WI:47690 */
import { navigationPaneLabel } from './MailModule.locstring.json';
import { isFeatureEnabled } from 'owa-feature-flags';
import { ModuleSwitcherLeftRail } from 'owa-module-switcher';
import { isLeftRailVisible } from 'owa-left-rail-utils/lib/isLeftRailVisible';
import loc from 'owa-localize';
import selectDefaultFolder from 'owa-mail-folder-forest-actions/lib/actions/selectDefaultFolder';
import { Module } from 'owa-workloads';
import * as React from 'react';
import {
    getLeftNavWidth,
    getDataMinMaxWidthsForLeftNav,
    shouldShowFolderPaneAsOverlay,
    shouldShowFolderPane,
    getLeftPaneStyles,
} from 'owa-mail-layout';
import { MailLeftPaneAsOverlay } from '../index'; // lazy import overlay left pane component
import FolderPaneContainer from './FolderPaneContainer';
import LeftPaneHamburgerButton from 'owa-mail-commandbar/lib/components/LeftPaneHamburgerButton';
import MailNewMessageButton from './MailNewMessageButton';
import { getInRibbonMode } from 'owa-command-ribbon-store';

interface MailLeftPaneProps {
    isInGroupsView?: boolean;
    shouldShowPublicFolderView: boolean;
    hideLeftRail?: boolean;
}

import styles from './MailModule.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export default observer(function MailLeftPane(props: MailLeftPaneProps) {
    const inRibbonMode = getInRibbonMode();

    /**
     * Renders the hamburger button and the new message button
     */
    const renderToggleAndNewMessageButtons = (
        showFolderPane: boolean,
        showFolderPaneAsOverlay: boolean
    ): JSX.Element => {
        const shouldShowNewMessageButton =
            showFolderPane && !showFolderPaneAsOverlay && !inRibbonMode;

        return (
            <div className={styles.leftPanelFirstRow}>
                <LeftPaneHamburgerButton isPaneExpanded={showFolderPane} />
                {shouldShowNewMessageButton && (
                    <MailNewMessageButton
                        isInGroupsView={props.isInGroupsView}
                        shouldShowPublicFolderView={props.shouldShowPublicFolderView}
                    />
                )}
                {inRibbonMode && <div className={styles.newMessageButtonWrapper} />}
            </div>
        );
    };

    const showFolderPane = shouldShowFolderPane();
    const showFolderPaneAsOverlay = shouldShowFolderPaneAsOverlay();
    const leftPaneClasses = classNames(styles.leftPaneContainer, getLeftPaneStyles());
    const { dataMin, dataMax } = getDataMinMaxWidthsForLeftNav();
    const showLeftRail =
        !props.hideLeftRail &&
        (!showFolderPane || isLeftRailVisible(Module.Mail) || showFolderPaneAsOverlay);
    return (
        <div
            tabIndex={-1}
            role={'region'}
            aria-label={loc(navigationPaneLabel)}
            className={leftPaneClasses}
            data-min-width={dataMin}
            data-max-width={dataMax}>
            {!isFeatureEnabled('mon-tri-collapsibleFolderPane') &&
                !isFeatureEnabled('mon-densities') &&
                !inRibbonMode &&
                renderToggleAndNewMessageButtons(showFolderPane, showFolderPaneAsOverlay)}
            <div className={styles.leftPanelSecondRow}>
                {showLeftRail && (
                    <ModuleSwitcherLeftRail
                        selectedModule={Module.Mail}
                        activeModuleAction={onModuleSelected}
                    />
                )}
                {showFolderPane && renderFolderPane(showLeftRail, showFolderPaneAsOverlay)}
            </div>
        </div>
    );
});

function onModuleSelected() {
    selectDefaultFolder('ModuleSwitcher');
}

/**
 * Renders the folder pane as an overlay or non-overlay
 */
function renderFolderPane(isLeftRailVisible: boolean, showFolderPaneAsOverlay: boolean) {
    if (!showFolderPaneAsOverlay) {
        return (
            <FolderPaneContainer
                leftNavWidth={getLeftNavWidth()}
                isLeftRailVisible={isLeftRailVisible}
            />
        );
    }
    return <MailLeftPaneAsOverlay isLeftRailVisible={isLeftRailVisible} />;
}
