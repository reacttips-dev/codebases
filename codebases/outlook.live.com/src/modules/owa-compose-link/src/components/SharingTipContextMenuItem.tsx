import { observer } from 'mobx-react-lite';
import { Icon } from '@fluentui/react/lib/Icon';
import { ControlIcons } from 'owa-control-icons';
import { InfoBarMessageRank } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import { lazyIgnoreSharingTip, LinkActionStatus, SharingLinkInfo } from 'owa-link-data';
import loc from 'owa-localize';
import { ChangePermissionsText } from 'owa-locstrings/lib/strings/changepermissionstext.locstring.json';
import { SuggestActionIgnoreExpiration } from 'owa-locstrings/lib/strings/suggestactionignoreexpiration.locstring.json';
import { SuggestActionRefreshTheLink } from 'owa-locstrings/lib/strings/suggestactionrefreshthelink.locstring.json';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';
import {
    ODBSharingInfo,
    refreshExpirationDate,
    SharingTipAction,
    SharingTipInfo,
    SharingTipRecipientInfo,
} from 'owa-sharing-data';
import * as React from 'react';
import { canDownloadLink } from '../utils/canDownloadLink';
import {
    logAttachAsCopySharingTipDatapoint,
    logChangePermsSharingTipDatapoint,
    logIgnoreSharingTipDatapoint,
    logRefreshExpirationDatapoint,
} from '../utils/contextMenu/sharingTipContextMenuItem/logSharingTipDatapoints';
import {
    getDisplayString,
    getInfoIconTooltip,
} from '../utils/contextMenu/sharingTipContextMenuItem/sharingTipStrings';
import { getProviderAndAttachLinkAsCopy } from '../utils/getProviderAndAttachLinkAsCopy';
import { onOpenSharingDialogClicked } from '../utils/onOpenSharingDialogClicked';
import { closeLinkContextMenu } from './LinkContextMenu';
import {
    SuggestActionAttachACopy,
    SuggestActionRetryRefreshingTheLink,
} from './SharingTipContextMenuItem.locstring.json';
import { SharingTipOverlay } from './SharingTipOverlay';

import menuItemStyles from './LinkContextMenuCustomItems.scss';
import sharingTipStyles from './SharingTipContextMenuItem.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(sharingTipStyles);

export interface SharingTipContextMenuItemProps {
    sharingLinkInfo: SharingLinkInfo;
    sharingIssue: SharingTipInfo;
    composeId: string;
    recipientInfos: SharingTipRecipientInfo[];
    isCalendar: boolean;
}

export const SharingTipContextMenuItem = observer(function SharingTipContextMenuItem(
    props: SharingTipContextMenuItemProps
) {
    const targetWindow = React.useContext(ProjectionContext);
    const getSharingTipMessageAndActions = (
        sharingLinkInfo: SharingLinkInfo,
        sharingIssue: SharingTipInfo
    ) => {
        // Note - as we add more actions we will probably want to move to a mapping from sharingTipAction to button.
        const showIgnore = sharingIssue.sharingTipActions.indexOf(SharingTipAction.ignore) !== -1;
        const showRefresh =
            sharingIssue.sharingTipActions.indexOf(SharingTipAction.refreshExpiration) !== -1 &&
            sharingLinkInfo.sharingInfo.canRefresh;
        const refreshString =
            sharingLinkInfo.linkActionStatus === LinkActionStatus.refreshFailed
                ? loc(SuggestActionRetryRefreshingTheLink)
                : loc(SuggestActionRefreshTheLink);
        const hasManageAccess =
            sharingLinkInfo.sharingInfo.canShareExternally ||
            sharingLinkInfo.sharingInfo.canShareInternally;
        const showChangePerms =
            sharingIssue.sharingTipActions.indexOf(SharingTipAction.changePermission) !== -1 &&
            hasManageAccess;
        const showAttachAsCopy =
            sharingIssue.sharingTipActions.indexOf(SharingTipAction.attachAsACopy) !== -1 &&
            !showChangePerms &&
            canDownloadLink(sharingLinkInfo);
        // We over-write the sharing tip string for when the refresh fails.
        const displayString: string = getDisplayString(
            sharingIssue.id,
            sharingIssue.sharingTipString,
            sharingLinkInfo.linkActionStatus,
            sharingLinkInfo.sharingInfo.expirationDate
        );

        return (
            <div className={menuItemStyles.text}>
                <span className={sharingTipStyles.paddingRight}>{displayString}</span>
                {showRefresh && (
                    <>
                        <button className={sharingTipStyles.actionButton} onClick={refreshLink}>
                            {refreshString}
                        </button>
                        <span className={sharingTipStyles.divider}> {' | '} </span>
                    </>
                )}
                {showChangePerms && (
                    <>
                        <button
                            className={sharingTipStyles.actionButton}
                            onClick={changePermission}>
                            {loc(ChangePermissionsText)}
                        </button>
                        <span className={sharingTipStyles.divider}> {' | '} </span>
                    </>
                )}
                {showAttachAsCopy && (
                    <>
                        <button className={sharingTipStyles.actionButton} onClick={attachACopy}>
                            {loc(SuggestActionAttachACopy)}
                        </button>
                        <span className={sharingTipStyles.divider}> {' | '} </span>
                    </>
                )}
                {
                    /*Note - ignore should always be last*/ showIgnore && (
                        <button className={sharingTipStyles.actionButton} onClick={ignoreTip}>
                            {loc(SuggestActionIgnoreExpiration)}
                        </button>
                    )
                }
            </div>
        );
    };
    const refreshLink = (event: React.MouseEvent<HTMLButtonElement>) => {
        refreshExpirationDate(props.sharingLinkInfo.linkId);
        logRefreshExpirationDatapoint(props.sharingIssue.id);
        event.stopPropagation();
    };
    const changePermission = (event: React.MouseEvent<HTMLButtonElement>) => {
        const sharingInfo: ODBSharingInfo = props.sharingLinkInfo.sharingInfo as ODBSharingInfo;
        onOpenSharingDialogClicked(
            sharingInfo,
            props.sharingLinkInfo.linkId,
            props.sharingLinkInfo.permissionLevel,
            props.composeId,
            props.recipientInfos,
            targetWindow,
            props.isCalendar
        );
        logChangePermsSharingTipDatapoint(props.sharingIssue.id);
        event.stopPropagation();
    };
    const attachACopy = (event: React.MouseEvent<HTMLButtonElement>) => {
        getProviderAndAttachLinkAsCopy(props.sharingLinkInfo.linkId, targetWindow);
        logAttachAsCopySharingTipDatapoint(props.sharingIssue.id);
        closeLinkContextMenu();
        event.stopPropagation();
    };
    const ignoreTip = (event: React.MouseEvent<HTMLButtonElement>) => {
        lazyIgnoreSharingTip
            .import()
            .then(ignoreSharingTip =>
                ignoreSharingTip(props.sharingLinkInfo.linkId, props.sharingIssue.id)
            );
        logIgnoreSharingTipDatapoint(props.sharingIssue.id);
        event.stopPropagation();
    };
    const { sharingIssue, sharingLinkInfo } = props;
    const conditionalStyles = {
        error: sharingIssue.messageRank === InfoBarMessageRank.Error,
    };
    const infoTooltip = getInfoIconTooltip(sharingIssue.id, sharingLinkInfo.linkActionStatus);
    return (
        <div
            className={menuItemStyles.menuItemContainer}
            aria-label={sharingIssue.sharingTipString}
            aria-posinset={1}
            aria-setsize={7}
            aria-disabled="false"
            role="menuitem"
            onClick={null}
            tabIndex={0}>
            <SharingTipOverlay sharingLinkInfo={sharingLinkInfo} sharingIssue={sharingIssue} />
            <div className={menuItemStyles.iconContainer}>
                <Icon
                    iconName={ControlIcons.Info}
                    className={classNames(sharingTipStyles.sharingTipIcon, conditionalStyles)}
                    title={infoTooltip}
                />
            </div>
            {getSharingTipMessageAndActions(sharingLinkInfo, sharingIssue)}
        </div>
    );
});
