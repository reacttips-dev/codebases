import owaEmptyState_lib_svg_HighContrast_illustration_errorSvg from 'owa-empty-state/lib/svg/HighContrast/illustration_error.svg';
import owaEmptyState_lib_svg_Light_illustration_errorSvg from 'owa-empty-state/lib/svg/Light/illustration_error.svg';
import owaEmptyState_lib_svg_Dark_illustration_errorSvg from 'owa-empty-state/lib/svg/Dark/illustration_error.svg';
import owaEmptyState_lib_svg_DarkTheme_illustration_errorSvg from 'owa-empty-state/lib/svg/DarkTheme/illustration_error.svg';
import owaEmptyState_lib_svg_LightTheme_illustration_errorSvg from 'owa-empty-state/lib/svg/LightTheme/illustration_error.svg';
import { observer } from 'mobx-react-lite';
import EmptyState, { EmptyStateProps } from 'owa-empty-state/lib/components/EmptyState';
import loc from 'owa-localize';
import { getIsMsHighContrast } from 'owa-high-contrast';
import { getIsLightBaseTheme, getIsDarkBaseTheme } from 'owa-theme';
import { getIsDarkTheme } from 'owa-fabric-theme';
import * as React from 'react';
import {
    timePanelErrorMainMessage,
    timePanelErrorDetailMessage,
} from './TimePanelError.locstring.json';

/**
 * initialize the SVG icons
 */
let ERROR_STATE;

import styles from './TimePanelError.scss';

export default observer(function TimePanelError() {
    return (
        <div className={styles.emptyStateContainer}>
            <EmptyState
                {...getErrorEmptyStateProps()}
                classNames={{ container: styles.container, mainMessage: styles.mainMessage }}
            />
        </div>
    );
});

function getErrorEmptyStateProps(): EmptyStateProps {
    initializeDisplayIconsForEmptyList();
    return {
        icon: ERROR_STATE,
        mainMessage: loc(timePanelErrorMainMessage),
        detailMessage: loc(timePanelErrorDetailMessage),
    };
}

function initializeDisplayIconsForEmptyList() {
    if (getIsMsHighContrast()) {
        ERROR_STATE = owaEmptyState_lib_svg_HighContrast_illustration_errorSvg;
    } else if (getIsLightBaseTheme()) {
        ERROR_STATE = owaEmptyState_lib_svg_Light_illustration_errorSvg;
    } else if (getIsDarkBaseTheme()) {
        ERROR_STATE = owaEmptyState_lib_svg_Dark_illustration_errorSvg;
    } else if (getIsDarkTheme()) {
        ERROR_STATE = owaEmptyState_lib_svg_DarkTheme_illustration_errorSvg;
    } else {
        ERROR_STATE = owaEmptyState_lib_svg_LightTheme_illustration_errorSvg;
    }
}
