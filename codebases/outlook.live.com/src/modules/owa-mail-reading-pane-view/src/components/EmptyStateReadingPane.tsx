import owaEmptyState_lib_svg_Ghost_Light_illustration_mailSvg from 'owa-empty-state/lib/svg/Ghost/Light/illustration_mail.svg';
import owaEmptyState_lib_svg_HighContrast_illustration_mailSvg from 'owa-empty-state/lib/svg/HighContrast/illustration_mail.svg';
import owaEmptyState_lib_svg_HighContrast_illustration_no_wifiSvg from 'owa-empty-state/lib/svg/HighContrast/illustration_no_wifi.svg';
import owaEmptyState_lib_svg_Light_illustration_mailSvg from 'owa-empty-state/lib/svg/Light/illustration_mail.svg';
import owaEmptyState_lib_svg_Light_illustration_no_wifiSvg from 'owa-empty-state/lib/svg/Light/illustration_no_wifi.svg';
import owaEmptyState_lib_svg_Ghost_Dark_illustration_mailSvg from 'owa-empty-state/lib/svg/Ghost/Dark/illustration_mail.svg';
import owaEmptyState_lib_svg_Dark_illustration_mailSvg from 'owa-empty-state/lib/svg/Dark/illustration_mail.svg';
import owaEmptyState_lib_svg_Dark_illustration_no_wifiSvg from 'owa-empty-state/lib/svg/Dark/illustration_no_wifi.svg';
import owaEmptyState_lib_svg_DarkTheme_illustration_mailSvg from 'owa-empty-state/lib/svg/DarkTheme/illustration_mail.svg';
import owaEmptyState_lib_svg_DarkTheme_illustration_no_wifiSvg from 'owa-empty-state/lib/svg/DarkTheme/illustration_no_wifi.svg';
import owaEmptyState_lib_svg_LightTheme_illustration_mailSvg from 'owa-empty-state/lib/svg/LightTheme/illustration_mail.svg';
import owaEmptyState_lib_svg_LightTheme_illustration_no_wifiSvg from 'owa-empty-state/lib/svg/LightTheme/illustration_no_wifi.svg';
import owaEmptyState_lib_svg_Dark_illustration_mail_notfoundSvg from 'owa-empty-state/lib/svg/Dark/illustration_mail_notfound.svg';
import owaEmptyState_lib_svg_HighContrast_illustration_mail_notfoundSvg from 'owa-empty-state/lib/svg/HighContrast/illustration_mail_notfound.svg';
import owaEmptyState_lib_svg_Light_illustration_mail_notfoundSvg from 'owa-empty-state/lib/svg/Light/illustration_mail_notfound.svg';
import {
    errorCannotCompleteRequestLineOne,
    errorCannotCompleteRequestLineTwo,
    safeToCloseString,
    nothingIsSelected,
    errorMessageNotFound,
    goToInboxString,
} from './EmptyStateReadingPane.locstring.json';
import { emptyStateMessageSelectAnItemToRead } from 'owa-locstrings/lib/strings/emptystatemessageselectanitemtoread.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { isDeepLink, getOrigin, getMailPath } from 'owa-url';
import { observer } from 'mobx-react-lite';
import { updateAddinOnNavigationToEmptyNullReadingPane } from 'owa-mail-addins';
import EmptyState from 'owa-empty-state/lib/components/EmptyState';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { getIsMsHighContrast } from 'owa-high-contrast';
import { getIsLightBaseTheme, getIsDarkBaseTheme } from 'owa-theme';
import { recoverableItemsFolderDescription } from './ReadingPane.locstring.json';
import { MailListViewState } from 'owa-mail-store/lib/store/schema/MailListViewState';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './EmptyStateReadingPane.scss';

let NO_SELECTION_SVG;
let EMPTY_ERROR_SVG;
let NO_SELECTION_GHOST_SVG;
let NOT_FOUND_SVG;

export interface EmptyStateReadingPaneProps {
    isError?: boolean;
    isDumpsterOrDumpsterSearchTable?: boolean;
    mailListViewState?: MailListViewState;
}

const EmptyStateReadingPane = observer(function EmptyStateReadingPane(
    props: EmptyStateReadingPaneProps
) {
    React.useEffect(() => {
        updateAddinOnNavigationToEmptyNullReadingPane();
    }, []);

    initializeSvgsForTheme();

    let emptyStateIcon = NO_SELECTION_SVG;
    let mainMessageText = loc(emptyStateMessageSelectAnItemToRead);
    let detailsMessageText = loc(nothingIsSelected);
    let ctaMessageText = null;
    let onCtaClickHandler = undefined;
    let actionButtonStyle = undefined;

    if (props.isError && isDeepLink()) {
        emptyStateIcon = NOT_FOUND_SVG;
        mainMessageText = loc(errorMessageNotFound);
        detailsMessageText = null;
    } else if (props.isError) {
        emptyStateIcon = EMPTY_ERROR_SVG;
        mainMessageText = loc(errorCannotCompleteRequestLineOne);
        detailsMessageText = loc(errorCannotCompleteRequestLineTwo);
    } else if (isDeepLink()) {
        mainMessageText = loc(safeToCloseString);
        detailsMessageText = null;
        if (isFeatureEnabled('fwk-mailtoProtocolHandler')) {
            ctaMessageText = loc(goToInboxString);
            onCtaClickHandler = () => {
                window?.open(`${getOrigin()}${getMailPath()}inbox`, '_self');
            };
            actionButtonStyle = styles.actionButton;
        }
    } else if (props.mailListViewState === MailListViewState.Empty) {
        emptyStateIcon = NO_SELECTION_GHOST_SVG;
        mainMessageText = null;
        detailsMessageText = null;
    } else if (props.isDumpsterOrDumpsterSearchTable) {
        mainMessageText = loc(recoverableItemsFolderDescription);
        detailsMessageText = null;
    }

    return (
        <EmptyState
            icon={emptyStateIcon}
            mainMessage={mainMessageText}
            detailMessage={detailsMessageText}
            ctaMessage={ctaMessageText}
            onCtaClick={onCtaClickHandler}
            classNames={{
                container: styles.emptyState,
                button: actionButtonStyle,
            }}
        />
    );
});

function initializeSvgsForTheme() {
    const isLightBaseTheme = getIsLightBaseTheme();

    if (getIsMsHighContrast()) {
        NO_SELECTION_GHOST_SVG = owaEmptyState_lib_svg_Ghost_Light_illustration_mailSvg;
        NO_SELECTION_SVG = owaEmptyState_lib_svg_HighContrast_illustration_mailSvg;
        EMPTY_ERROR_SVG = owaEmptyState_lib_svg_HighContrast_illustration_no_wifiSvg;
        NOT_FOUND_SVG = owaEmptyState_lib_svg_HighContrast_illustration_mail_notfoundSvg;
    } else if (isLightBaseTheme) {
        NO_SELECTION_GHOST_SVG = owaEmptyState_lib_svg_Ghost_Light_illustration_mailSvg;
        NO_SELECTION_SVG = owaEmptyState_lib_svg_Light_illustration_mailSvg;
        EMPTY_ERROR_SVG = owaEmptyState_lib_svg_Light_illustration_no_wifiSvg;
        NOT_FOUND_SVG = owaEmptyState_lib_svg_Light_illustration_mail_notfoundSvg;
    } else if (getIsDarkBaseTheme()) {
        NO_SELECTION_GHOST_SVG = owaEmptyState_lib_svg_Ghost_Dark_illustration_mailSvg;
        NO_SELECTION_SVG = owaEmptyState_lib_svg_Dark_illustration_mailSvg;
        EMPTY_ERROR_SVG = owaEmptyState_lib_svg_Dark_illustration_no_wifiSvg;
        NOT_FOUND_SVG = owaEmptyState_lib_svg_Dark_illustration_mail_notfoundSvg;
    } else if (getIsDarkTheme()) {
        NO_SELECTION_GHOST_SVG = owaEmptyState_lib_svg_Ghost_Dark_illustration_mailSvg;
        NO_SELECTION_SVG = owaEmptyState_lib_svg_DarkTheme_illustration_mailSvg;
        EMPTY_ERROR_SVG = owaEmptyState_lib_svg_DarkTheme_illustration_no_wifiSvg;
        NOT_FOUND_SVG = owaEmptyState_lib_svg_Dark_illustration_mail_notfoundSvg;
    } else {
        //colorful theme grayscale svgs
        NO_SELECTION_GHOST_SVG = owaEmptyState_lib_svg_Ghost_Light_illustration_mailSvg;
        NO_SELECTION_SVG = owaEmptyState_lib_svg_LightTheme_illustration_mailSvg;
        EMPTY_ERROR_SVG = owaEmptyState_lib_svg_LightTheme_illustration_no_wifiSvg;
        NOT_FOUND_SVG = owaEmptyState_lib_svg_Light_illustration_mail_notfoundSvg;
    }
}

export default EmptyStateReadingPane;
