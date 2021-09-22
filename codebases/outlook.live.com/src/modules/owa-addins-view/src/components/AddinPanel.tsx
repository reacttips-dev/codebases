import * as React from 'react';
import classNames from 'classnames';
import { FocusTrapZone } from '@fluentui/react/lib/FocusTrapZone';
import { Panel } from '@fluentui/react/lib/Panel';
import { isShySuiteHeaderMode } from 'owa-suite-header-store';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';

import styles from './AddinPanel.scss';

export interface AddinPanelProps {
    renderInPanel: boolean;
    onDismiss: () => void;
    isDeepLink: boolean;
    disableFirstFocus: boolean;
    children?: React.ReactNode;
}

export const AddinPanel: React.StatelessComponent<AddinPanelProps> = (props: AddinPanelProps) => {
    const targetWindow = React.useContext(ProjectionContext);

    const taskPaneClassName = classNames(
        styles.taskPane,
        targetWindow !== window && styles.taskPaneInPopout,
        props.isDeepLink && styles.taskPaneNoHeader,
        {
            isShyHeaderMode: isShySuiteHeaderMode(),
        }
    );

    if (props.renderInPanel) {
        return (
            <Panel
                focusTrapZoneProps={{
                    forceFocusInsideTrap: false,
                    disableFirstFocus: props.disableFirstFocus,
                    isClickableOutsideFocusTrap: true,
                }}
                hasCloseButton={false}
                isOpen={true}
                onDismiss={props.onDismiss}
                className={taskPaneClassName}
                isBlocking={false}
                isFooterAtBottom={true}
                isLightDismiss={true}>
                {props.children}
            </Panel>
        );
    } else {
        return (
            <FocusTrapZone
                forceFocusInsideTrap={false}
                isClickableOutsideFocusTrap={true}
                className={styles.taskPane}>
                {props.children}
            </FocusTrapZone>
        );
    }
};
