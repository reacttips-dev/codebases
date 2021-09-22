import { observer } from 'mobx-react-lite';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import { pinTitle } from './MailListItemIconBar.locstring.json';
import { moveTo } from 'owa-locstrings/lib/strings/moveto.locstring.json';
import { unpin } from 'owa-locstrings/lib/strings/unpin.locstring.json';
import { markAsRead } from 'owa-locstrings/lib/strings/markasread.locstring.json';
import { archive } from 'owa-locstrings/lib/strings/archive.locstring.json';
import { deleteItem } from 'owa-locstrings/lib/strings/deleteitem.locstring.json';
import { markAsUnread } from 'owa-locstrings/lib/strings/markasunread.locstring.json';
import loc from 'owa-localize';
import { lazyGetFlagContextMenu } from '../index';
import { HoverIcon, PropertyIcon, HoverActionIconProps, PropertyIconProps } from './shared/IconBar';
import getBackgroundColorClass from '../selectors/getBackgroundColorClass';
import getIsChecked from '../selectors/getIsChecked';
import getFlagCompleteHelper from '../utils/getFlagCompleteHelper';
import type MailListItemDataProps from '../utils/types/MailListItemDataProps';
import type MailListTableProps from '../utils/types/MailListTableProps';
import type { IContextualMenuProps } from '@fluentui/react/lib/ContextualMenu';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isFolderInMailboxType } from 'owa-folders';
import {
    getMailMenuItemShouldShowMap,
    doesUserHaveSharedFolderPermissionFor,
    MenuItemType,
} from 'owa-mail-filterable-menu-behavior';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { MailIcons } from 'owa-mail-icons';
import PropertyIcons from 'owa-mail-list-actions/lib/utils/conversationProperty/PropertyIcons';
import getPropertyIconStyle from 'owa-mail-list-actions/lib/utils/conversationProperty/getPropertyIconStyle';
import { hideMailItemContextMenu } from 'owa-mail-list-actions/lib/actions/itemContextMenuActions';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import { lazyToggleRowReadState } from 'owa-mail-mark-read-actions';
import { getMoveToPropertiesForContextMenu } from 'owa-mail-movetofolder-view';
import { getFolderIdFromTableView } from 'owa-mail-search';
import * as lazyTriageActions from 'owa-mail-triage-action';
import type { HoverActionKey } from 'owa-outlook-service-options';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import SmimeType from 'owa-smime-adapter/lib/store/schema/SmimeType';
import getIconForSmimeType from 'owa-smime/lib/utils/getIconForSmimeType';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { getBigHoverAction } from 'owa-surface-actions/lib/utils/getBigHoverAction';
import { deleteRow, archiveRow } from '../utils/getClickHandler';
import { lazyLogSpotlightResultsRendered, lazyGetSpotlightLogicalId } from 'owa-mail-spotlight';
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider';
import { getIconBarTheme } from 'owa-mail-densities/lib/utils/getIconBarTheme';
import { getDensityModeString } from 'owa-fabric-theme';
import { default as FlashlightRegular } from 'owa-fluent-icons-svg/lib/icons/FlashlightRegular';
import { default as Archive } from 'owa-fluent-icons-svg/lib/icons/ArchiveRegular';
import { default as FolderArrowRight } from 'owa-fluent-icons-svg/lib/icons/FolderArrowRightRegular';
import { default as Delete } from 'owa-fluent-icons-svg/lib/icons/DeleteRegular';
import { default as MailRead } from 'owa-fluent-icons-svg/lib/icons/MailReadRegular';
import { default as Mail } from 'owa-fluent-icons-svg/lib/icons/MailRegular';
import { default as PinFilled } from 'owa-fluent-icons-svg/lib/icons/PinFilled';
import { default as FlagFilled } from 'owa-fluent-icons-svg/lib/icons/FlagFilled';
import { default as Checkmark } from 'owa-fluent-icons-svg/lib/icons/CheckmarkRegular';
import { default as Pin } from 'owa-fluent-icons-svg/lib/icons/PinRegular';

import * as React from 'react';
import {
    getHoverSurfaceAction,
    getStore as getHoverSurfaceActionStore,
} from 'owa-surface-actions-option';

// Remark: We have to share css file with MailListItem since we need to trigger child hover selectors
// off of the MailListItem container css class
import styles from './MailListItem.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);
const hoverActionSource = 'Hover';

export interface MailListItemIconBarProps {
    mailListItemDataProps: MailListItemDataProps;
    mailListTableProps: MailListTableProps;
    neverShowHoverIcons?: boolean;
    neverShowPropertyIcons?: boolean;
    tableViewId: string;
    lastDeliveryTimestamp: string;
    rowKey: string;
    isRowExpanded: boolean;
}

/*
Renders the mail list icon bar for both action icons and property icons
*/
export default observer(function MailListItemIconBar(props: MailListItemIconBarProps) {
    const [spotlightPropertyIconPresent, setSpotlightPropertyIconPresent] = React.useState(false);

    const hasDensityNext = isFeatureEnabled('mon-densities');
    const tableView = listViewStore.tableViews.get(props.mailListTableProps.tableViewId);
    const neverShowHoverIcons = props.neverShowHoverIcons;
    const isSingleLine = props.mailListTableProps.isSingleLine;
    const hasBigHoverAction =
        (isFeatureEnabled('mon-tri-mailListItemHoverDelete') && !isSingleLine) ||
        (isFeatureEnabled('mon-tri-mailListItemHoverDeleteSlv') && isSingleLine);
    const showHoverActions = useComputedValue((): boolean => {
        if (!tableView) {
            return false;
        }
        return (
            !neverShowHoverIcons &&
            ((tableView.selectedRowKeys.size == 1 && tableView.isInCheckedMode) ||
                (tableView.selectedRowKeys.size <= 1 && !tableView.isInVirtualSelectAllMode))
        );
    }, [props.mailListTableProps.tableViewId]);

    const onDismissMoveToMenu = React.useCallback((ev?: MouseEvent) => {
        hideMailItemContextMenu();
        lazyResetFocus.importAndExecute();
    }, []);

    const moveRow = React.useCallback((): IContextualMenuProps => {
        return getMoveToPropertiesForContextMenu(
            props.mailListTableProps.tableViewId,
            onDismissMoveToMenu,
            hoverActionSource,
            getMailMenuItemShouldShowMap(),
            DirectionalHint.bottomLeftEdge,
            [props.mailListItemDataProps.rowKey]
        );
    }, [
        props.mailListTableProps.tableViewId,
        onDismissMoveToMenu,
        props.mailListItemDataProps.rowKey,
    ]);

    const toggleMarkAsReadRow = React.useCallback(() => {
        lazyToggleRowReadState.importAndExecute(
            props.mailListItemDataProps.rowKey,
            props.mailListTableProps.tableViewId,
            hoverActionSource
        );
    }, [props.mailListItemDataProps.rowKey, props.mailListTableProps.tableViewId]);

    const togglePinnedStateRow = React.useCallback(() => {
        lazyTriageActions.lazyToggleRowPinnedState.importAndExecute(
            props.mailListItemDataProps.rowKey,
            props.mailListTableProps.tableViewId,
            hoverActionSource
        );
        // Reset focus after the stitch to pin the item is raised
        lazyResetFocus.importAndExecute();
    }, [props.mailListItemDataProps.rowKey, props.mailListTableProps.tableViewId]);

    const flaggedOnContextMenu = React.useCallback(
        (evt: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
            evt.stopPropagation();
            evt.persist();
            lazyGetFlagContextMenu.importAndExecute(
                props.mailListItemDataProps.rowKey,
                props.mailListTableProps.tableViewId,
                null /* nodeId */,
                hoverActionSource,
                evt
            );
            evt.preventDefault();
        },
        [props.mailListItemDataProps.rowKey, props.mailListTableProps.tableViewId]
    );

    const toggleFlaggedStateRow = React.useCallback(() => {
        lazyTriageActions.lazyToggleRowsFlagState.importAndExecute(
            [props.mailListItemDataProps.rowKey],
            props.mailListTableProps.tableViewId,
            hoverActionSource
        );
        // Reset focus after the stitch to flag the item is raised
        lazyResetFocus.importAndExecute();
    }, [props.mailListItemDataProps.rowKey, props.mailListTableProps.tableViewId]);

    const getFlagCompleteEntry = React.useCallback(() => {
        const {
            mailListItemDataProps: { isFlagged, isComplete },
        } = props;
        const flagCompleteEntry = {
            title: null,
            key: null,
            onClickCommand: toggleFlaggedStateRow,
            onContextMenu: flaggedOnContextMenu,
        };
        return getFlagCompleteHelper(flagCompleteEntry, isFlagged, isComplete, hasDensityNext);
    }, [
        props.mailListItemDataProps.isFlagged,
        props.mailListItemDataProps.isComplete,
        flaggedOnContextMenu,
    ]);

    const shouldHideSlvHoverIcon = (hoverIconKey: string) => {
        switch (hoverIconKey) {
            case 'pinIcon':
                const {
                    mailListItemDataProps: { isFlagged, isComplete, isPinned },
                } = props;
                return hasBigHoverAction && (isFlagged || isComplete) && !isPinned;
            default:
                return false;
        }
    };

    const flagEntry = getFlagCompleteEntry();
    const isArchiveFolder = props.mailListItemDataProps.isInArchiveFolder;
    const getHoverActionIcons = useComputedValue((): HoverActionIconProps[] => {
        const hoverActions = [];
        const mailListItemDataProps = props.mailListItemDataProps;
        const mailListTableProps = props.mailListTableProps;
        let hoverActionKeys: HoverActionKey[] = getHoverSurfaceActionStore().hoverSurfaceActions;
        const iconClassStyles = !hasDensityNext && classNames(styles.hoverIconFontSize, 'icons'); // Add styles for the icon within the button
        // If in notes folder, only show delete hover icon
        // Else no values exist in the store, read values from owa userConfig.
        if (mailListItemDataProps.isInNotesFolder) {
            hoverActionKeys = ['Delete'];
        } else if (hoverActionKeys === null) {
            hoverActionKeys = getHoverSurfaceAction();
        }
        const bigHoverAction = hasBigHoverAction ? getBigHoverAction(hoverActionKeys) : '';
        hoverActionKeys.forEach(action => {
            switch (action) {
                case 'Archive':
                    if (bigHoverAction !== action && !isArchiveFolder) {
                        /*We do not want the icon to be shown if already shown in the big hover action.*/
                        hoverActions[0] = {
                            title: loc(archive),
                            key: 'archiveIcon',
                            iconName: hasDensityNext ? Archive : ControlIcons.Archive,
                            iconClassName: iconClassStyles,
                            onClickCommand: () =>
                                archiveRow(
                                    props.mailListItemDataProps.rowKey,
                                    props.mailListTableProps.tableViewId,
                                    hoverActionSource
                                ),
                        };
                    }
                    break;
                case 'Move':
                    hoverActions[1] = {
                        title: loc(moveTo),
                        key: 'moveIcon',
                        iconName: hasDensityNext
                            ? FolderArrowRight
                            : ControlIcons.FabricMovetoFolder,
                        menuProps: moveRow(),
                        iconClassName: iconClassStyles,
                    };
                    break;
                case 'Delete':
                    if (
                        mailListItemDataProps.canDelete &&
                        bigHoverAction !==
                            action /*We do not want the icon to be shown if already shown in the big hover action.*/
                    ) {
                        hoverActions[2] = {
                            title: loc(deleteItem),
                            key: 'deleteIcon',
                            iconName: hasDensityNext ? Delete : ControlIcons.Delete,
                            iconClassName: iconClassStyles,
                            onClickCommand: () =>
                                deleteRow(
                                    props.mailListItemDataProps.rowKey,
                                    props.mailListTableProps.tableViewId,
                                    hoverActionSource
                                ),
                        };
                    }
                    break;
                case 'ReadUnread':
                    const hasUnread = mailListItemDataProps.unreadCount > 0;
                    let iconName;
                    if (hasDensityNext) {
                        iconName = hasUnread ? MailRead : Mail;
                    } else {
                        iconName = hasUnread ? ControlIcons.Read : ControlIcons.Mail;
                    }
                    hoverActions[3] = {
                        title: hasUnread ? loc(markAsRead) : loc(markAsUnread),
                        key: 'markReadIcon',
                        iconName: iconName,
                        iconClassName: iconClassStyles,
                        onClickCommand: toggleMarkAsReadRow,
                    };
                    break;
                case 'FlagUnflag':
                    if (
                        mailListTableProps.supportsFlagging &&
                        doesUserHaveSharedFolderPermissionFor(
                            MenuItemType.Flag
                        ) /* Shared folder permission check */
                    ) {
                        flagEntry.iconClassName = classNames(
                            flagEntry.iconClassName,
                            iconClassStyles
                        );
                        hoverActions[4] = flagEntry;
                    }
                    break;
                case 'PinUnpin':
                    const isPinned = mailListItemDataProps.isPinned;
                    if (
                        mailListTableProps.supportsPinning &&
                        mailListItemDataProps.canPin &&
                        doesUserHaveSharedFolderPermissionFor(
                            MenuItemType.Pin
                        ) /* Shared folder permission check */
                    ) {
                        const pinClasses = classNames(isPinned && styles.pinIcon);
                        let iconName;
                        if (hasDensityNext) {
                            iconName = isPinned ? PinFilled : Pin;
                        } else {
                            iconName = isPinned ? ControlIcons.PinnedSolid : MailIcons.Pin;
                        }
                        hoverActions[5] = {
                            title: isPinned ? loc(unpin) : loc(pinTitle),
                            key: 'pinIcon',
                            iconClassName: classNames(pinClasses, iconClassStyles),
                            iconName: iconName,
                            onClickCommand: togglePinnedStateRow,
                        };
                    }
                    break;
                case 'None':
                    break;
            }
        });

        return hoverActions;
    }, [props.mailListItemDataProps, props.mailListTableProps]);
    const getPropertyIconProps = useComputedValue((): PropertyIconProps[] => {
        const propertyIconProps: PropertyIconProps[] = [];
        const mailListTableProps = props.mailListTableProps;
        const mailListItemDataProps = props.mailListItemDataProps;
        const tableView = listViewStore.tableViews.get(mailListTableProps.tableViewId);
        // Build the property icon list from left to right
        // Item class icon first (meeting, note, etc.)
        if (
            mailListItemDataProps.itemClassIcon &&
            mailListItemDataProps.itemClassIcon !== PropertyIcons.None
        ) {
            propertyIconProps.push({
                key: mailListItemDataProps.itemClassIcon.toString(),
                ...getPropertyIconStyle(mailListItemDataProps.itemClassIcon, hasDensityNext),
            });
        }
        // Importance icon
        if (mailListItemDataProps.importance == 'Low') {
            propertyIconProps.push({
                key: PropertyIcons.ImportanceLow.toString(),
                ...getPropertyIconStyle(PropertyIcons.ImportanceLow, hasDensityNext),
            });
        } else if (mailListItemDataProps.importance == 'High') {
            propertyIconProps.push({
                key: PropertyIcons.ImportanceHigh.toString(),
                ...getPropertyIconStyle(PropertyIcons.ImportanceHigh, hasDensityNext),
            });
        }
        // S/MIME icons
        if (mailListItemDataProps.smimeType !== SmimeType.None) {
            const smimeIcon:
                | MailIcons
                | ControlIcons
                | 'LockClosedRegular'
                | 'RibbonRegular' = getIconForSmimeType(
                mailListItemDataProps.smimeType,
                hasDensityNext
            );
            smimeIcon &&
                propertyIconProps.push({
                    key: smimeIcon,
                    iconName: smimeIcon,
                });
        }
        // Attachment icon
        if (mailListItemDataProps.hasAttachment) {
            propertyIconProps.push({
                key: PropertyIcons.Attachment.toString(),
                ...getPropertyIconStyle(PropertyIcons.Attachment, hasDensityNext),
            });
        } else if (
            isFeatureEnabled('doc-linkDiscovery-useNewProperty') &&
            mailListItemDataProps.hasSharepointLink
        ) {
            propertyIconProps.push({
                key: PropertyIcons.Link.toString(),
                ...getPropertyIconStyle(PropertyIcons.Link, hasDensityNext),
            });
        }
        // At mention icon
        if (mailListItemDataProps.effectiveMentioned) {
            propertyIconProps.push({
                key: PropertyIcons.GlobalMentionedMe.toString(),
                ...(mailListItemDataProps.unreadCount > 0 // If it is unread, show blue, else show grey
                    ? getPropertyIconStyle(PropertyIcons.GlobalMentionedMe, hasDensityNext)
                    : getPropertyIconStyle(PropertyIcons.ReadGlobalMentionedMe, hasDensityNext)),
            });
        }
        // If the conversation/item has like count greater than 0, then show the LikeIcon
        // Likes should not be seeing when Reactions are enabled.
        if (
            !isConsumer() &&
            !isFeatureEnabled('rp-reactions') &&
            !isFolderInMailboxType(getFolderIdFromTableView(tableView), 'SharedMailbox') &&
            mailListItemDataProps.likeCount > 0
        ) {
            propertyIconProps.push({
                key: PropertyIcons.Like.toString(),
                ...getPropertyIconStyle(PropertyIcons.Like, hasDensityNext),
            });
        }
        // If the conversation/item has been snoozed or tagged for big screen, then show the clock icon
        if (mailListItemDataProps.isSnoozed || mailListItemDataProps.isTaggedForBigScreen) {
            propertyIconProps.push({
                key: PropertyIcons.Snooze.toString(),
                ...getPropertyIconStyle(PropertyIcons.Snooze, hasDensityNext),
            });
        }
        // Spotlight icon
        let hasSpotlightIcon = false;
        if (mailListItemDataProps.shouldShowAsSpotlight) {
            hasSpotlightIcon = true;
            propertyIconProps.push({
                id: `spotlightIcon${mailListItemDataProps.rowKey}`,
                key: 'spotlightIcon',
                iconClasses: classNames(styles.spotlightIcon),
                iconName: FlashlightRegular,
            });
        }
        setSpotlightPropertyIconPresent(hasSpotlightIcon);
        // Complete icon
        if (
            mailListTableProps.supportsFlagging &&
            mailListItemDataProps.isComplete &&
            doesUserHaveSharedFolderPermissionFor(
                MenuItemType.Flag
            ) /* Shared folder permission check */
        ) {
            propertyIconProps.push({
                key: 'completeIcon',
                iconName: hasDensityNext ? Checkmark : ControlIcons.CheckMark,
            });
        }
        // Flag icon
        if (
            mailListTableProps.supportsFlagging &&
            mailListItemDataProps.isFlagged &&
            !mailListItemDataProps.isComplete &&
            doesUserHaveSharedFolderPermissionFor(
                MenuItemType.Flag
            ) /* Shared folder permission check */
        ) {
            propertyIconProps.push({
                key: 'flagIcon',
                iconClasses: styles.flagIcon,
                iconName: hasDensityNext ? FlagFilled : ControlIcons.EndPointSolid,
            });
        }
        // Pin icon if pinned
        // Add flag/complete icon as the right most icon if pinning is not supported
        // If pinning is supported we leave a place for pin hover action/property icon
        if (
            mailListTableProps.supportsPinning &&
            (mailListItemDataProps.isPinned ||
                mailListItemDataProps.isFlagged ||
                mailListItemDataProps.isComplete) &&
            doesUserHaveSharedFolderPermissionFor(
                MenuItemType.Pin
            ) /* Shared folder permission check */
        ) {
            const pinIconClasses = classNames(
                styles.pinIcon,
                (mailListItemDataProps.isFlagged || mailListItemDataProps.isComplete) &&
                    !mailListItemDataProps.isPinned &&
                    'visibilityHidden'
            );

            propertyIconProps.push({
                key: 'pinIcon',
                iconClasses: pinIconClasses,
                iconName: hasDensityNext ? PinFilled : ControlIcons.PinnedSolid,
            });
        }

        return propertyIconProps;
    }, [props.mailListItemDataProps, props.mailListTableProps]);
    const backgroundColorClass = useComputedValue(() => {
        const { mailListItemDataProps, mailListTableProps, isRowExpanded } = props;
        const tableView = listViewStore.tableViews.get(mailListTableProps.tableViewId);
        const isChecked = getIsChecked(
            tableView,
            mailListItemDataProps.rowKey,
            mailListItemDataProps.lastDeliveryTimestamp
        );
        return getBackgroundColorClass(
            mailListItemDataProps,
            mailListTableProps,
            isChecked,
            isRowExpanded
        );
    }, [props.mailListItemDataProps, props.mailListTableProps, props.isRowExpanded]);

    /**
     * This effect handles instrumentation for rendering of the Spotlight property
     * icon. It re-runs when spotlightLogicalId changes because it means that we'll
     * have made a new Spotlight request.
     */
    const spotlightLogicalId = lazyGetSpotlightLogicalId.tryImportForRender()?.();
    React.useEffect(() => {
        if (spotlightPropertyIconPresent) {
            lazyLogSpotlightResultsRendered.importAndExecute();
        }
    }, [spotlightLogicalId]);

    const iconBarContainerStyle = styles.iconBarContainer;
    const containerClassNames = classNames(
        hasBigHoverAction && styles.iconBarNext,
        backgroundColorClass,
        iconBarContainerStyle,
        !showHoverActions && !hasBigHoverAction && styles.doNotShowHoverActions,
        'icons',
        !hasDensityNext && 'iconsShape', // The dimensions for hover actions have been factored out for theme provider
        !hasDensityNext && styles.iconShape // The dimensions for hover actions have been factored out for theme provider
    );
    const hasBigHoverAndSingleLine = isSingleLine && hasBigHoverAction;

    const iconKeyIntersectionSet = useComputedValue(() => {
        // Find Icons in both property and hover icons for hovering. if a property icon is only in hover actions, always show the hover action and hide the property icon
        if (!hasBigHoverAndSingleLine) {
            return null;
        }
        const hoverIconKeySet = new Set();
        const keyIntersectionSet = new Set();
        getHoverActionIcons.forEach(item => {
            hoverIconKeySet.add(item.key);
        });

        getPropertyIconProps.forEach(item => {
            if (hoverIconKeySet.has(item.key)) {
                keyIntersectionSet.add(item.key);
            }
        });
        return keyIntersectionSet;
    }, [props.mailListItemDataProps, props.mailListTableProps]);

    return (
        <ThemeProvider
            applyTo="none"
            theme={hasDensityNext && getIconBarTheme(getDensityModeString())}>
            <div className={containerClassNames}>
                {!props.neverShowHoverIcons &&
                    getHoverActionIcons.map(hoverProps => (
                        <HoverIcon
                            {...hoverProps}
                            key={hoverProps.key}
                            iconClasses={classNames(
                                hoverProps.iconClasses,
                                styles.hoverActionIcon,
                                hasBigHoverAndSingleLine && styles.slvWithBigHoverAction,
                                shouldHideSlvHoverIcon(hoverProps.key)
                                    ? styles.slvIconHide
                                    : iconKeyIntersectionSet?.has(hoverProps.key) &&
                                          styles.slvIconShow,
                                styles.icon
                            )}
                        />
                    ))}
                {!props.neverShowPropertyIcons &&
                    getPropertyIconProps.map(propertyIconProps => (
                        <PropertyIcon
                            {...propertyIconProps}
                            key={propertyIconProps.key}
                            iconClasses={classNames(
                                propertyIconProps.iconClasses,
                                !hasDensityNext && styles.propertyIcon,
                                styles.propertyIconHide,
                                hasBigHoverAndSingleLine &&
                                    !iconKeyIntersectionSet?.has(propertyIconProps.key) &&
                                    styles.propertyIconShow, // keep hover icons with a big hover action
                                iconKeyIntersectionSet?.has(propertyIconProps.key) &&
                                    styles.slvIconHide
                            )}
                        />
                    ))}
            </div>
        </ThemeProvider>
    );
});
