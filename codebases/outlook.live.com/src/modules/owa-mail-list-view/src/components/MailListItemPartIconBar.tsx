import getFlagCompleteHelper from '../utils/getFlagCompleteHelper';
import { DefaultPalette } from '@fluentui/style-utilities/lib/styles';
import { observer } from 'mobx-react-lite';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isGroupTableQuery } from 'owa-group-utils';
import loc from 'owa-localize';
import { deleteItem } from 'owa-locstrings/lib/strings/deleteitem.locstring.json';
import { markAsRead } from 'owa-locstrings/lib/strings/markasread.locstring.json';
import { markAsUnread } from 'owa-locstrings/lib/strings/markasunread.locstring.json';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import type { MailIcons } from 'owa-mail-icons';
import { getPropertyIconStyle, PropertyIcons } from 'owa-mail-list-actions';
import getItemClassIcon from 'owa-mail-list-actions/lib/utils/conversationProperty/getItemClassIcon';
import { listViewStore, MailFolderTableQuery, TableQueryType } from 'owa-mail-list-store';
import getItemForMailList from 'owa-mail-store/lib/selectors/getItemForMailList';
import { lazyGetFlagContextMenu } from '../index';
import { lazyMarkItemsAsReadBasedOnNodeIds } from 'owa-mail-mark-read-actions';
import { isSpotlightItem } from 'owa-mail-spotlight';
import type ClientItem from 'owa-mail-store/lib/store/schema/ClientItem';
import * as lazyTriageActions from 'owa-mail-triage-action';
import type { HoverActionKey } from 'owa-outlook-service-options';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import type FlagStatus from 'owa-service/lib/contract/FlagStatus';
import type Message from 'owa-service/lib/contract/Message';
import { isConsumer } from 'owa-session-store';
import { getDensityModeString } from 'owa-fabric-theme';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import getIconForSmimeType from 'owa-smime/lib/utils/getIconForSmimeType';
import getSmimeType from 'owa-smime/lib/utils/getSmimeType';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import * as React from 'react';
import {
    HoverIcon,
    PropertyIcon,
    HoverActionIconProps /*PropertyIconProps*/,
    PropertyIconProps,
} from './shared/IconBar';
import {
    getHoverSurfaceAction,
    getStore as getHoverSurfaceActionStore,
} from 'owa-surface-actions-option';
import { getBigHoverAction } from 'owa-surface-actions/lib/utils/getBigHoverAction';
import { deleteItemPartRow } from '../utils/getClickHandler';
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider';
import { getIconBarTheme } from 'owa-mail-densities/lib/utils/getIconBarTheme';
import FlashlightRegular from 'owa-fluent-icons-svg/lib/icons/FlashlightRegular';
import DeleteRegular from 'owa-fluent-icons-svg/lib/icons/DeleteRegular';
import MailReadRegular from 'owa-fluent-icons-svg/lib/icons/MailReadRegular';
import MailRegular from 'owa-fluent-icons-svg/lib/icons/MailRegular';
import FlagFilled from 'owa-fluent-icons-svg/lib/icons/FlagFilled';
import CheckmarkRegular from 'owa-fluent-icons-svg/lib/icons/CheckmarkRegular';

import styles from './MailListItemPart.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListItemPartIconBarProps {
    nodeId: string;
    tableViewId: string;
    isSingleLine: boolean;
    tableViewSupportsFlagging: boolean;
    containerClassName?: string;
    isFirstLevelExpansion?: boolean;
    neverShowHoverIcons?: boolean;
    neverShowPropertyIcons?: boolean;
}

/*
Renders the mail list item part icon bar for both action icons and property icons
*/
export default observer(function MailListItemPartIconBar(props: MailListItemPartIconBarProps) {
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const getHoverActionIcons = (): HoverActionIconProps[] => {
        const tableView = listViewStore.tableViews.get(props.tableViewId);
        const item: Message = getItemForMailList(props.nodeId, props.isFirstLevelExpansion);
        const canDelete = !isGroupTableQuery(tableView.tableQuery);
        const hoverActions = [];
        let hoverActionKeys: HoverActionKey[] = getHoverSurfaceActionStore().hoverSurfaceActions;
        // If no values exist in the store, read values from owa userConfig.
        if (hoverActionKeys === null) {
            hoverActionKeys = getHoverSurfaceAction();
        }
        const bigHoverAction =
            (isFeatureEnabled('mon-tri-mailListItemHoverDelete') && !props.isSingleLine) ||
            (isFeatureEnabled('mon-tri-mailListItemHoverDeleteSlv') && props.isSingleLine)
                ? getBigHoverAction(hoverActionKeys)
                : '';
        hoverActionKeys.forEach(action => {
            switch (action) {
                case 'Delete':
                    if (canDelete && bigHoverAction !== action) {
                        /*We do not want the icon to be shown if already shown in the big hover action.*/
                        hoverActions[2] = {
                            title: loc(deleteItem),
                            key: 'deleteIcon',
                            iconName: hasDensityNext ? DeleteRegular : ControlIcons.Delete,
                            onClickCommand: () =>
                                deleteItemPartRow(props.tableViewId, props.nodeId, 'Hover'),
                        };
                    }
                    break;
                case 'ReadUnread':
                    let iconName;
                    const isRead = item.IsRead;
                    if (hasDensityNext) {
                        iconName = isRead ? MailRegular : MailReadRegular;
                    } else {
                        iconName = isRead ? ControlIcons.Read : ControlIcons.Mail;
                    }
                    hoverActions[3] = {
                        title: item.IsRead ? loc(markAsUnread) : loc(markAsRead),
                        key: 'markReadIcon',
                        iconName: iconName,
                        onClickCommand: () => toggleMarkAsReadRow(item),
                    };
                    break;
                case 'FlagUnflag':
                    if (props.tableViewSupportsFlagging) {
                        hoverActions[4] = getFlagCompleteEntry(item);
                    }
                    break;
                case 'None':
                    break;
            }
        });
        return hoverActions;
    };

    const getFlagCompleteEntry = (item: Message) => {
        const flagStatus = item.Flag?.FlagStatus;
        const flagCompleteEntry = {
            title: null,
            key: null,
            onClickCommand: () => toggleFlaggedStateRow(item),
            onContextMenu: flaggedOnContextMenu,
        };
        const isComplete = flagStatus == 'Complete';
        const isFlagged = flagStatus == 'Flagged';
        return getFlagCompleteHelper(flagCompleteEntry, isFlagged, isComplete, hasDensityNext);
    };

    const toggleMarkAsReadRow = async (item: Message) => {
        const tableView = listViewStore.tableViews.get(props.tableViewId);

        const markItemsAsReadBasedOnNodeIds = await lazyMarkItemsAsReadBasedOnNodeIds.import();
        markItemsAsReadBasedOnNodeIds(
            [props.nodeId],
            tableView.id,
            !item.IsRead /* isReadValueToSet */,
            true /* isExplicit */,
            'Hover'
        );

        // Reset focus after the stitch to mark the item as read is raised
        lazyResetFocus.importAndExecute();
    };

    const flaggedOnContextMenu = (evt: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        evt.stopPropagation();
        evt.persist();
        lazyGetFlagContextMenu.importAndExecute(
            null /* rowKey */,
            props.tableViewId,
            props.nodeId,
            'Hover',
            evt
        );
        evt.preventDefault();
    };

    const toggleFlaggedStateRow = (item: Message) => {
        let flagStatusValueToSet: FlagStatus;
        switch (item.Flag.FlagStatus) {
            case 'Complete':
            case 'NotFlagged':
                flagStatusValueToSet = 'Flagged';
                break;
            case 'Flagged':
                flagStatusValueToSet = !isConsumer() ? 'Complete' : 'NotFlagged';
                break;
        }
        lazyTriageActions.lazySetItemsFlagStateFromItemIds.importAndExecute(
            [item.ItemId.Id],
            null,
            { FlagStatus: flagStatusValueToSet },
            props.tableViewId,
            'Hover'
        );
        // Reset focus after the stitch to flag the item is raised
        lazyResetFocus.importAndExecute();
    };

    const shouldShowSpotlightPropertyIcon = useComputedValue(() => {
        const item: Message = getItemForMailList(props.nodeId, props.isFirstLevelExpansion);
        const tableView = listViewStore.tableViews.get(props.tableViewId);
        const scenarioType = (tableView.tableQuery as MailFolderTableQuery).scenarioType;

        /**
         * Don't show Spotlight treatment in non "mail" or "spotlight" (Important
         * filter) scenarios.
         */
        if (scenarioType !== 'mail' && scenarioType !== 'spotlight') {
            return false;
        }

        // Don't show Spotlight treatment in search results.
        if (tableView.tableQuery.type === TableQueryType.Search) {
            return false;
        }

        // Don't show Spotlight treatment if item isn't a Spotlight item.
        if (!isSpotlightItem({ itemId: item.ItemId.Id })) {
            return false;
        }

        // Don't show Spotlight treatment when not in Inbox.
        if (
            tableView.tableQuery.folderId &&
            folderIdToName(tableView.tableQuery.folderId) != 'inbox'
        ) {
            return false;
        }

        return true;
    }, [props.tableViewId, props.nodeId]);

    const getPropertyIconProps = (): PropertyIconProps[] => {
        const propertyIconProps: PropertyIconProps[] = [];
        const item: Message = getItemForMailList(props.nodeId, props.isFirstLevelExpansion);
        const itemClassIcon = getItemClassIcon(
            [item.ItemClass],
            item.IconIndex,
            false /* hasIrm */
        );
        const flagStatus = item.Flag?.FlagStatus;
        // Build the property icon list from left to right
        // Item class icon first (meeting, note, etc.)
        if (itemClassIcon && itemClassIcon != PropertyIcons.None) {
            propertyIconProps.push({
                ...getPropertyIconStyle(itemClassIcon, hasDensityNext),
                key: itemClassIcon.toString(),
            });
        }
        // Importance icon
        if (item.Importance == 'Low') {
            propertyIconProps.push({
                ...getPropertyIconStyle(PropertyIcons.ImportanceLow, hasDensityNext),
                key: PropertyIcons.ImportanceLow.toString(),
            });
        } else if (item.Importance == 'High') {
            propertyIconProps.push({
                ...getPropertyIconStyle(PropertyIcons.ImportanceHigh, hasDensityNext),
                key: PropertyIcons.ImportanceHigh.toString(),
            });
        }
        // S/MIME icon
        if (isSMIMEItem(item)) {
            const smimeIcon:
                | MailIcons
                | ControlIcons
                | 'RibbonRegular'
                | 'LockClosedRegular' = getIconForSmimeType(
                getSmimeType(item as ClientItem),
                hasDensityNext
            );
            smimeIcon &&
                propertyIconProps.push({
                    iconName: smimeIcon,
                    key: smimeIcon,
                });
        }
        // Attachment icon
        if (item.HasAttachments) {
            propertyIconProps.push({
                ...getPropertyIconStyle(PropertyIcons.Attachment, hasDensityNext),
                key: PropertyIcons.Attachment.toString(),
            });
        }
        // At mention icon
        if (item.MentionedMe) {
            propertyIconProps.push({
                ...getPropertyIconStyle(PropertyIcons.GlobalMentionedMe, hasDensityNext),
                key: PropertyIcons.GlobalMentionedMe.toString(),
            });
        }
        // If the conversation/item has like count greater than 0, then show the LikeIcon
        if (!isConsumer() && item.LikeCount && item.LikeCount > 0) {
            propertyIconProps.push({
                ...getPropertyIconStyle(PropertyIcons.Like, hasDensityNext),
                key: PropertyIcons.Like.toString(),
            });
        }
        // Spotlight icon
        if (shouldShowSpotlightPropertyIcon) {
            propertyIconProps.push({
                key: 'spotlightIcon',
                iconClasses: styles.spotlightIcon,
                iconName: FlashlightRegular,
            });
        }
        // Flag/Complete icon
        if (props.tableViewSupportsFlagging) {
            if (flagStatus == 'Flagged') {
                propertyIconProps.push({
                    iconClasses: styles.flagIcon,
                    iconName: hasDensityNext ? FlagFilled : ControlIcons.EndPointSolid,
                    key: 'flagIcon',
                });
            } else if (!isConsumer() && flagStatus == 'Complete') {
                propertyIconProps.push({
                    iconName: hasDensityNext ? CheckmarkRegular : ControlIcons.CheckMark,
                    key: 'completeIcon',
                });
            }
        }
        // If the conversation/item has been snoozed, then show the clock icon
        if (item.ReturnTime) {
            propertyIconProps.push({
                ...getPropertyIconStyle(PropertyIcons.Snooze, hasDensityNext),
                key: PropertyIcons.Snooze.toString(),
            });
        }
        return propertyIconProps;
    };
    const { neverShowPropertyIcons, neverShowHoverIcons } = props;
    const isSenderImageOff = getIsBitSet(ListViewBitFlagsMasks.HideSenderImage);
    const containerClassNames = classNames(
        props.containerClassName,
        props.isSingleLine
            ? isSenderImageOff
                ? styles.iconBarSingleLineViewContainerNoSenderImage
                : styles.iconBarSingleLineViewContainer
            : styles.iconBarThreeColumnContainer,
        neverShowPropertyIcons && styles.hoverIconsOnly,
        DefaultPalette.neutralLight,
        'icons',
        !hasDensityNext && styles.iconsShape
    );
    const propertyIconClasses = classNames(
        !hasDensityNext && styles.propertyIcon,
        styles.propertyIconHide,
        neverShowHoverIcons && styles.propertyIconShow,
        !hasDensityNext && styles.iconShape
    );
    const hoverIconClasses = classNames(
        styles.hoverActionIcon,
        styles.icon,
        !hasDensityNext && styles.iconShape
    );
    return (
        <ThemeProvider
            applyTo="none"
            theme={hasDensityNext && getIconBarTheme(getDensityModeString())}
            className={containerClassNames}>
            {!neverShowHoverIcons &&
                getHoverActionIcons().map(hoverProps => (
                    <HoverIcon
                        {...hoverProps}
                        key={hoverProps.key}
                        iconClasses={classNames(hoverProps.iconClasses, hoverIconClasses)}
                    />
                ))}
            {!neverShowPropertyIcons &&
                getPropertyIconProps().map(propertyIconProps => (
                    <PropertyIcon
                        {...propertyIconProps}
                        key={propertyIconProps.key}
                        iconClasses={classNames(propertyIconProps.iconClasses, propertyIconClasses)}
                    />
                ))}
        </ThemeProvider>
    );
});
