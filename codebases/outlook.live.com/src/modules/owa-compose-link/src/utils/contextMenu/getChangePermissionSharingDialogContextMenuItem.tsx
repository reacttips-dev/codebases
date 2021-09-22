import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { Icon } from '@fluentui/react/lib/Icon';
import { logUsage } from 'owa-analytics';
import { getLinkPermissionLevelString } from 'owa-attachment-permission';
import { ControlIcons } from 'owa-control-icons';
import { getSharingLinkInfo, SharingLinkInfo } from 'owa-link-data';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type { ODBSharingInfo, SharingTipRecipientInfo } from 'owa-sharing-data';
import * as React from 'react';
import { LinkActionSource } from '../../types/LinkActionSource';
import { getPermissionLevelIcon } from '../getPermissionLevelIcon';
import { onOpenSharingDialogClicked } from '../onOpenSharingDialogClicked';

import styles from '../../components/LinkContextMenuCustomItems.scss';
import classNames from 'classnames';

export function getChangePermissionSharingDialogContextMenuItem(
    linkId: string,
    composeId: string,
    recipientInfos: SharingTipRecipientInfo[],
    targetWindow: Window,
    isCalendar: boolean
): IContextualMenuItem | null {
    const sharingLink: SharingLinkInfo = getSharingLinkInfo(linkId);
    const sharingInfo: ODBSharingInfo = sharingLink.sharingInfo as ODBSharingInfo;
    // If we cannot get an access token we do not show the sharing dialog
    if (!sharingLink.accessTokenAvailable) {
        return null;
    }

    const onClick = () => {
        logUsage('AttachmentLinkViewChangePermissionSharingDialog', [LinkActionSource.contextMenu]);
        onOpenSharingDialogClicked(
            sharingInfo,
            sharingLink.linkId,
            sharingLink.permissionLevel,
            composeId,
            recipientInfos,
            targetWindow,
            isCalendar
        );
    };

    return {
        key: 'ChangePermissionsSharingDialog',
        onRender: (
            item: any,
            dismissMenu: (ev?: any, dismissAll?: boolean) => void
        ): React.ReactNode => {
            return (
                <button
                    className={classNames(styles.menuItemContainer, styles.buttonStyles)}
                    aria-label={getLinkPermissionLevelString(
                        sharingLink.permissionLevel,
                        AttachmentDataProviderType.OneDrivePro
                    )}
                    aria-posinset={1}
                    aria-setsize={7}
                    aria-disabled="false"
                    role="menuitem"
                    onClick={onClick}
                    tabIndex={0}>
                    <div className={styles.iconContainer}>
                        <img
                            src={getPermissionLevelIcon(sharingLink.permissionLevel)}
                            className={styles.permissionIcon}
                        />
                    </div>
                    <div className={classNames(styles.text, styles.paddingForChevron)}>
                        {getLinkPermissionLevelString(
                            sharingLink.permissionLevel,
                            AttachmentDataProviderType.OneDrivePro
                        )}
                    </div>
                    <Icon
                        iconName={ControlIcons.ChevronRight}
                        className={classNames(styles.chevronRight, 'flipForRtl')}
                    />
                </button>
            );
        },
    };
}
