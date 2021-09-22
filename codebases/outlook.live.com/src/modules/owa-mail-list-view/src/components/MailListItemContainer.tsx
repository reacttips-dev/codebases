import { lazySetupMailListItemContainerKeys } from './lazy/lazyListViewModule';
import MailListItem from './MailListItem';
import getBackgroundColorClass from '../selectors/getBackgroundColorClass';
import getIsChecked from '../selectors/getIsChecked';
import getUnreadItemClass from '../selectors/getUnreadItemClass';
import { getClickHandler } from '../utils/getClickHandler';
import onMailListItemClickHandler from '../utils/onMailListItemClickHandler';
import type MailListItemDataProps from '../utils/types/MailListItemDataProps';
import type MailListTableProps from '../utils/types/MailListTableProps';
import { IconButton } from '@fluentui/react/lib/Button';
import { observer } from 'mobx-react-lite';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import Draggable from 'owa-dnd/lib/components/Draggable';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getIsMsHighContrast } from 'owa-high-contrast';
import { useKeydownHandler, useLazyKeydownHandler } from 'owa-hotkeys';
import loc from 'owa-localize';
import { draftSenderPersonaPlaceholder } from 'owa-locstrings/lib/strings/draftsenderpersonaplaceholder.locstring.json';
import { flaggedFilter } from 'owa-locstrings/lib/strings/flaggedfilter.locstring.json';
import { noSubject } from 'owa-locstrings/lib/strings/nosubject.locstring.json';
import { pinnedGroupHeader } from 'owa-locstrings/lib/strings/pinnedgroupheader.locstring.json';
import { unreadFilter } from 'owa-locstrings/lib/strings/unreadfilter.locstring.json';
import { FocusComponent, lazySetFocusToSynchronous, tabIndex } from 'owa-mail-focus-manager';
import { getMinimumRowHeight } from 'owa-mail-layout';
import PropertyIcons from 'owa-mail-list-actions/lib/utils/conversationProperty/PropertyIcons';
import { showMailItemContextMenu } from 'owa-mail-list-actions/lib/actions/itemContextMenuActions';
import MailListContextMenuSource from 'owa-mail-list-store/lib/store/schema/MailListContextMenuSource';
import MailListContextMenuType from 'owa-mail-list-store/lib/store/schema/MailListContextMenuType';
import { MailListItemExpansion } from '../index';
import { mailStore } from 'owa-mail-store';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { formatRelativeDate } from 'owa-observable-datetime';
import { getAnchorForContextMenu } from 'owa-positioning';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getBigHoverAction } from 'owa-surface-actions/lib/utils/getBigHoverAction';
import { ITouchHandlerParams, touchHandler } from 'owa-touch-handler';
import { isBrowserEdge, isBrowserIE } from 'owa-user-agent/lib/userAgent';
import { getDensityModeString } from 'owa-fabric-theme';
import { getBigHoverActionButtonColors } from '../utils/getBigHoverActionButtonColors';
import * as React from 'react';
import {
    hasAttachments,
    important,
    meeting,
    meetingAccepted,
    meetingDeclined,
    meetingTentative,
    meetingCanceled,
} from './MailListItemContainer.locstring.json';
import {
    TableQueryType,
    TableView,
    getItemsOrConversationsSelectedText,
    listViewStore,
} from 'owa-mail-list-store';
import {
    getMailListDragPreview,
    MAIL_ITEM_DRAG_XOFFSET,
    MAIL_ITEM_DRAG_YOFFSET,
} from '../utils/mailListDragUtil';
import {
    getHoverSurfaceAction,
    getStore as getHoverSurfaceActionStore,
} from 'owa-surface-actions-option';
import {
    isFirstLevelExpanded,
    isSecondLevelExpanded,
    isLoadingSecondLevelExpansion,
} from 'owa-mail-list-store/lib/selectors/isConversationExpanded';

import styles from './MailListItem.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListItemContainerProps {
    mailListTableProps: MailListTableProps;
    mailListItemDataProps: MailListItemDataProps;
    resetListViewContentTabIndex: () => void;
    isFocusInMailList: () => boolean;
    styleSelectorAsPerUserSettings: string;
}

function useClearFocusOnUnmount(listViewItem: React.RefObject<HTMLDivElement>) {
    React.useEffect(
        () => () => {
            // If item about to be unmounted had focus, set focus to the mail list component immediately so we do not
            // lose focus to body.
            if (listViewItem.current?.contains(document.activeElement)) {
                lazySetFocusToSynchronous.importAndExecute(FocusComponent.MailList);
            }
        },
        []
    );
}

function useUpdateFocusOnFocusChange(
    listViewItem: React.RefObject<HTMLDivElement>,
    shouldRowBeFocused: boolean,
    {
        isFocusInMailList,
        resetListViewContentTabIndex,
    }: Pick<MailListItemContainerProps, 'isFocusInMailList' | 'resetListViewContentTabIndex'>
) {
    React.useEffect(() => {
        if (shouldRowBeFocused) {
            window.requestAnimationFrame(() => {
                // Check whether focus is in the listview before setting focus on item. There are cases in which focused row
                // might change when the focus is in a different component like compose, in which we do NOT want to focus to
                // go to a mail list item. Example: when in the unread filter, if user clicks on an item and replies, the item
                // disappears from list view and the next item gets selected. If this check wasn't here, then focus
                // would jump from compose to that newly selected mail list item.
                if (listViewItem.current && shouldRowBeFocused) {
                    if (isFocusInMailList()) {
                        // Focus on self if ref exists and the item is focused and focus is in mail list already
                        // We need state checks here because this is being called async on requestAnimationFrame.
                        listViewItem.current.focus();
                        listViewItem.current.setAttribute('tabindex', tabIndex.sequentialIndex);
                    } else {
                        const boundingRect = listViewItem.current.getBoundingClientRect();

                        /**
                         * This checks if the list view item that should be focused
                         * is fully in view or not. If it's not, then we'll scroll
                         * it into view.
                         *
                         * This covers the scenario where the "open the previous/next
                         * item" keyboard shortcut is used when focus isn't in
                         * the message list.
                         */
                        if (
                            !(
                                boundingRect.top >= 0 &&
                                boundingRect.left >= 0 &&
                                boundingRect.right <=
                                    (window.innerWidth || document.documentElement.clientWidth) &&
                                boundingRect.bottom <=
                                    (window.innerHeight || document.documentElement.clientHeight)
                            )
                        ) {
                            listViewItem.current.scrollIntoView();
                        }
                    }

                    // Reset listview content tabindex such that listview is
                    // not in a sequential keyboard navigation anymore once an item selected
                    resetListViewContentTabIndex();
                }
            });
        } else {
            // Only need to clear tab index if an item goes from focused to unfocused
            window.requestAnimationFrame(() => {
                if (listViewItem.current && !shouldRowBeFocused) {
                    // Clear tab index on item when it's no longer focused
                    // We need state checks here because this is being called async on requestAnimationFrame
                    listViewItem.current.setAttribute(
                        'tabindex',
                        tabIndex.nonSequentialIndex.toString()
                    );
                }
            });
        }
    }, [shouldRowBeFocused, isFocusInMailList, resetListViewContentTabIndex]);
}

function useLazyEvaluatedRowAriaInfo(
    shouldRowBeFocused: boolean,
    tableView: TableView,
    props: Pick<MailListItemContainerProps, 'mailListItemDataProps'>
) {
    const numRows = React.useRef<number | undefined>();
    const rowPos = React.useRef<number | undefined>();

    return useComputedValue(() => {
        // ONLY update the num rows / row position for aria if the row is focused, otherwise all rows will be rerendered
        // which is a HUGE perf impact!! The num rows or row position can change any time user does a row removal (delete, archive, move),
        // pin, receives a new email, does a bulk delete, etc.
        if (shouldRowBeFocused) {
            numRows.current =
                tableView.tableQuery.type === TableQueryType.Search
                    ? tableView.rowKeys.length
                    : tableView.totalRowsInView;
            rowPos.current = tableView.rowKeys.indexOf(props.mailListItemDataProps.rowKey);
        }

        return { numRows: numRows.current, rowPos: rowPos.current };
    }, [tableView, props.mailListItemDataProps.rowKey]);
}

export default observer(function MailListItemContainer(props: MailListItemContainerProps) {
    const listViewItem = React.useRef<HTMLDivElement>();
    const tableView = listViewStore.tableViews.get(props.mailListTableProps.tableViewId);

    const isChecked = useComputedValue(
        () =>
            getIsChecked(
                listViewStore.tableViews.get(props.mailListTableProps.tableViewId),
                props.mailListItemDataProps.rowKey,
                props.mailListItemDataProps.lastDeliveryTimestamp
            ),
        [
            props.mailListTableProps.tableViewId,
            props.mailListItemDataProps.rowKey,
            props.mailListItemDataProps.lastDeliveryTimestamp,
        ]
    );

    const shouldRowBeFocused = useComputedValue(
        () =>
            listViewStore.tableViews.get(props.mailListTableProps.tableViewId)?.focusedRowKey ===
            props.mailListItemDataProps.rowKey,
        [props.mailListTableProps.tableViewId, props.mailListItemDataProps.rowKey]
    );

    const isFirstLevelExpansion = useComputedValue(
        () =>
            listViewStore.tableViews.get(props.mailListTableProps.tableViewId)?.tableQuery
                .listViewType == ReactListViewType.Conversation &&
            isFirstLevelExpanded(props.mailListItemDataProps.rowKey) &&
            listViewStore.expandedConversationViewState.forks?.length > 1,
        [props.mailListTableProps.tableViewId, props.mailListItemDataProps.rowKey]
    );

    const isLoadingSecondLevel = useComputedValue(
        () =>
            listViewStore.tableViews.get(props.mailListTableProps.tableViewId)?.tableQuery
                .listViewType == ReactListViewType.Conversation &&
            isLoadingSecondLevelExpansion(props.mailListItemDataProps.rowKey),
        [props.mailListTableProps.tableViewId, props.mailListItemDataProps.rowKey]
    );

    const isSecondLevelExpansion = useComputedValue(
        () =>
            listViewStore.tableViews.get(props.mailListTableProps.tableViewId)?.tableQuery
                .listViewType == ReactListViewType.Conversation &&
            isSecondLevelExpanded(props.mailListItemDataProps.rowKey),
        [props.mailListTableProps.tableViewId, props.mailListItemDataProps.rowKey]
    );

    /**
     * The onContextMenu event handler which opens the context menu
     * @param evt the mouse event
     */
    const onItemContextMenu = React.useCallback(
        (evt: React.MouseEvent<HTMLElement> | KeyboardEvent) => {
            evt.stopPropagation();
            evt.preventDefault();

            const selectedRows = tableView.selectedRowKeys;

            // Select the row upon right click if
            // - user is not in selectAll mode
            // - and the row that clicked on is not selected yet
            if (
                !tableView.isInVirtualSelectAllMode &&
                (!selectedRows || !selectedRows.has(props.mailListItemDataProps.rowKey))
            ) {
                onMailListItemClickHandler(
                    evt,
                    MailListItemSelectionSource.MailListItemContextMenu,
                    props.mailListItemDataProps.rowKey,
                    props.mailListTableProps.tableViewId
                );
            }

            showMailItemContextMenu(
                getAnchorForContextMenu(evt),
                MailListContextMenuType.All,
                MailListContextMenuSource.MailListItem
            );
        },
        [props.mailListTableProps.tableViewId, props.mailListItemDataProps.rowKey, tableView]
    );

    useClearFocusOnUnmount(listViewItem);
    useUpdateFocusOnFocusChange(listViewItem, shouldRowBeFocused, props);
    useLazyKeydownHandler(listViewItem, lazySetupMailListItemContainerKeys.importAndExecute, props);
    useKeydownHandler(listViewItem, 'shift+f10', onItemContextMenu);

    const touchHandlerProps = React.useMemo(() => {
        const touchHandlerParams: ITouchHandlerParams = {
            onLongPress: onItemContextMenu,
            onClick: evt => {
                // Rather than directly calling the onClick handler, call click
                // on the ref div to also dismiss any context menus
                listViewItem.current.click();
            },
        };
        return touchHandler(touchHandlerParams);
    }, [onItemContextMenu]);

    const shouldShowRow = useComputedValue((): boolean => {
        const rowKey = props.mailListItemDataProps.rowKey;
        const rowKeyIndex = tableView.rowKeys.indexOf(rowKey);

        // Always render rows that are at the beginning of view or if do not virtualize flag is set
        if (listViewStore.doNotVirtualize || listViewStore.lastIndexToRender >= rowKeyIndex) {
            return true;
        }

        // If we do not have info for virtualization on the row key it is one of two scenarios:
        // 1) We have not scrolled yet (rowInfoForVlv is empty) and the row is out of initial view, so do not virtualize
        // 2) We have scrolled (rowInfoForVlv.size > 0) but the row has just come into view, in which case we want to show
        if (!listViewStore.rowInfoForVLV.get(rowKey)) {
            return listViewStore.rowInfoForVLV.size !== 0;
        }

        const rowKeyOffset = listViewStore.rowInfoForVLV.get(rowKey).rowOffset;
        const viewportHeight = listViewStore.offsetHeight;
        const buffer = isFeatureEnabled('tri-virtualizeLessAggressively') ? 2400 : 2000; // A pixel buffer on top and below the visible portion of the listview. This is used for virtualization so that if a user scrolls, some items will already be preloaded for them.

        // Otherwise only show if the row is within the user's view (with buffer)
        if (
            rowKeyOffset >= listViewStore.scrollTop - buffer &&
            rowKeyOffset <= viewportHeight + listViewStore.scrollTop + buffer
        ) {
            return true;
        }

        return false;
    }, [props.mailListTableProps.tableViewId, props.mailListItemDataProps.rowKey]);

    const getItemClassIconAriaLabel = (): string =>
        loc(ItemClassIconAriaLabelLookup[props.mailListItemDataProps.itemClassIcon]) || null;

    const getLabelForMailItem = (): string => {
        const {
            unreadCount,
            importance,
            hasAttachment,
            isFlagged,
            isPinned,
            subject,
            sendersOrRecipients,
            lastDeliveryTimestamp,
            thirdLineText,
            showDraftsIndicator,
        } = props.mailListItemDataProps;
        const labelArray = [];

        if (unreadCount > 0) {
            labelArray.push(loc(unreadFilter));
        }

        if (importance === 'High') {
            labelArray.push(loc(important));
        }

        if (hasAttachment) {
            labelArray.push(loc(hasAttachments));
        }

        if (isFlagged) {
            labelArray.push(loc(flaggedFilter));
        }

        if (isPinned) {
            labelArray.push(loc(pinnedGroupHeader));
        }

        // Add a label for item class icon (meetings)
        if (getItemClassIconAriaLabel()) {
            labelArray.push(getItemClassIconAriaLabel());
        }

        labelArray.push(sendersOrRecipients);

        if (showDraftsIndicator) {
            labelArray.push(loc(draftSenderPersonaPlaceholder));
        }

        labelArray.push(subject);

        if (!props.mailListItemDataProps.returnTime && lastDeliveryTimestamp) {
            labelArray.push(formatRelativeDate(lastDeliveryTimestamp));
        }

        // Only push preview text if it is not null (null when preview text off setting is on)
        if (thirdLineText) {
            labelArray.push(thirdLineText);
        }

        if (shouldRowBeFocused && tableView.selectedRowKeys.size !== 1) {
            labelArray.push(
                getItemsOrConversationsSelectedText(props.mailListTableProps.tableViewId)
            );
        }

        return labelArray.join(' '); // convert into string
    };

    const onMailListItemExpansionUnmount = () => {
        // Recapture focus when mail list item expansion collapses
        if (listViewItem.current) {
            if (tableView?.focusedRowKey === props.mailListItemDataProps.rowKey) {
                listViewItem.current.focus();
            } else {
                lazySetFocusToSynchronous.importAndExecute(FocusComponent.MailList);
            }
        }
    };

    const onClick = React.useCallback(
        evt => {
            const { mailListItemDataProps, mailListTableProps } = props;
            onMailListItemClickHandler(
                evt,
                MailListItemSelectionSource.MailListItemBody,
                mailListItemDataProps.rowKey,
                mailListTableProps.tableViewId
            );
        },
        [props.mailListItemDataProps, props.mailListTableProps]
    );

    const onDoubleClick = React.useCallback(
        evt => {
            evt.stopPropagation();
            const { mailListItemDataProps, mailListTableProps } = props;
            if (mailListTableProps.supportsDoubleClick) {
                onMailListItemClickHandler(
                    evt,
                    MailListItemSelectionSource.MailListItemBodyDoubleClick,
                    mailListItemDataProps.rowKey,
                    mailListTableProps.tableViewId
                );
            }
        },
        [props.mailListItemDataProps, props.mailListTableProps]
    );

    const isSelected = useComputedValue((): boolean => {
        return props.mailListItemDataProps.isSelected;
    }, [props.mailListItemDataProps.isSelected]);

    // In checked mode we have the parent container be draggable
    // Disable dragging if folderId or parentFolderId is of Notes Folder
    const canDrag = React.useCallback(() => {
        return (
            !props.mailListItemDataProps.isSelected &&
            props.mailListTableProps.canDragFromTable &&
            !props.mailListItemDataProps.isInNotesFolder
        );
    }, [
        props.mailListItemDataProps.isSelected,
        props.mailListTableProps.canDragFromTable,
        props.mailListItemDataProps.isInNotesFolder,
    ]);

    const isDraggable = React.useCallback(() => {
        return !props.mailListItemDataProps.isInGroup;
    }, [props.mailListItemDataProps.isInGroup]);

    const getItemSize = React.useCallback((itemId: string) => {
        const item = mailStore.items.get(itemId);
        return item?.Size;
    }, []);

    const getDragData = React.useCallback(() => {
        const itemProps = props.mailListItemDataProps;

        return {
            itemType: DraggableItemTypes.MailListRow,
            rowKeys: [props.mailListItemDataProps.rowKey],
            tableViewId: props.mailListTableProps.tableViewId,
            tableListViewType: tableView.tableQuery.listViewType,
            subjects: [itemProps.subject ? itemProps.subject : loc(noSubject)],
            sizes: [getItemSize(itemProps.latestItemId)],
            latestItemIds: [itemProps.latestItemId],
        };
    }, [
        props.mailListItemDataProps,
        tableView,
        props.mailListItemDataProps.rowKey,
        props.mailListTableProps.tableViewId,
    ]);

    const { numRows, rowPos } = useLazyEvaluatedRowAriaInfo(shouldRowBeFocused, tableView, props);

    const { mailListItemDataProps, mailListTableProps } = props;
    const isRowExpanded = isFirstLevelExpansion || isSecondLevelExpansion;

    const backgroundColorClass = getBackgroundColorClass(
        mailListItemDataProps,
        mailListTableProps,
        isChecked,
        isRowExpanded
    );

    const unreadItemClass = getUnreadItemClass(
        mailListItemDataProps,
        mailListTableProps,
        isChecked,
        styles.unreadMailListItem,
        styles.unreadMailListItemDarker
    );

    const shouldBackgroundChangeOnHover = !isSelected && !isChecked;
    const backgroundChangeOnColorStyle = styles.backgroundChangeOnHover;

    const isSingleLine = mailListTableProps.isSingleLine;
    const isHoverDeleteEnabled =
        (isFeatureEnabled('mon-tri-mailListItemHoverDelete') && !isSingleLine) ||
        (isFeatureEnabled('mon-tri-mailListItemHoverDeleteSlv') && isSingleLine);

    const bigHoverAction = isHoverDeleteEnabled
        ? getBigHoverAction(
              getHoverSurfaceActionStore().hoverSurfaceActions ?? getHoverSurfaceAction()
          )
        : '';

    const showBigHoverAction =
        bigHoverAction && shouldShowBigHoverAction(bigHoverAction, mailListItemDataProps.canDelete);

    const bigHoverOnClick = (event: React.MouseEvent<unknown>) => {
        event.stopPropagation();
        getClickHandler(bigHoverAction)(
            props.mailListItemDataProps.rowKey,
            props.mailListTableProps.tableViewId,
            'Hover'
        );
    };

    const unselectedHoverStyles =
        showBigHoverAction && !isSelected
            ? classNames(
                  mailListItemDataProps.isPinned && styles.isPinned,
                  styles.monarchUnselectedHover
              )
            : null;

    // Outer container CSS classes that are shared between 3 column and single line views
    const mailListItemOuterContainerClasses = classNames(
        showBigHoverAction && styles.showDeleteOnHover,
        !(isBrowserEdge() || isBrowserIE())
            ? styles.mailListItemNonEdgeIEPadding
            : styles.mailListItemPadding,
        styles.mailListItem,
        backgroundColorClass,
        shouldBackgroundChangeOnHover && backgroundChangeOnColorStyle,
        styles.showHoverActionsOnHover,
        mailListItemDataProps.unreadCount > 0 && unreadItemClass,
        unselectedHoverStyles
    );

    const itemAriaProps: AriaProperties = {
        role: AriaRoles.option,
        selected: isSelected,
        label: getLabelForMailItem() || null, // When no important information, do not add label
    };
    const isRowVirtualized = !shouldShowRow;
    const height = isRowVirtualized
        ? {
              height: listViewStore.rowInfoForVLV.get(mailListItemDataProps.rowKey)
                  ? listViewStore.rowInfoForVLV.get(mailListItemDataProps.rowKey).rowHeight
                  : getMinimumRowHeight(props.mailListItemDataProps.showCondensedView),
          }
        : null;

    return (
        <div
            id={mailListItemDataProps.rowKey}
            data-convid={mailListItemDataProps.conversationId}
            ref={listViewItem}
            tabIndex={-1}
            className={classNames(
                isRowVirtualized ? styles.vlvMailListItemContainer : styles.mailListItemContainer,
                isSelected && getIsMsHighContrast() && styles.hcBorder
            )}
            style={height}
            onClick={onClick}
            aria-selected={isSelected}
            aria-setsize={numRows}
            aria-posinset={rowPos}
            {...generateDomPropertiesForAria(itemAriaProps)}>
            {!isRowVirtualized && (
                <Draggable
                    canDrag={canDrag}
                    isDraggable={isDraggable}
                    getDragData={getDragData}
                    getDragPreview={getMailListDragPreview}
                    xOffset={MAIL_ITEM_DRAG_XOFFSET}
                    yOffset={MAIL_ITEM_DRAG_YOFFSET}>
                    <div
                        {...touchHandlerProps}
                        className={mailListItemOuterContainerClasses}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                        onContextMenu={onItemContextMenu}
                        tabIndex={-1}>
                        <MailListItem
                            mailListTableProps={mailListTableProps}
                            mailListItemDataProps={mailListItemDataProps}
                            styleSelectorAsPerUserSettings={props.styleSelectorAsPerUserSettings}
                            isFirstLevelExpanded={isFirstLevelExpansion}
                            isSecondLevelExpanded={isSecondLevelExpansion}
                            isLoadingSecondLevelExpansion={isLoadingSecondLevel}
                        />
                        {showBigHoverAction && (
                            <IconButton
                                iconProps={{ iconName: bigHoverAction }}
                                className={classNames(
                                    getDensityModeString(),
                                    styles.showBigActionButton,
                                    getBigHoverActionButtonColors(styles, bigHoverAction),
                                    isSingleLine && styles.slvBigHover,
                                    styles.firstRowHeights,
                                    isFeatureEnabled('mon-densities') &&
                                        isSingleLine &&
                                        styles.slvDensityNext
                                )}
                                onClick={bigHoverOnClick}
                            />
                        )}
                    </div>
                </Draggable>
            )}
            {isRowExpanded && (
                <MailListItemExpansion
                    onUnmount={onMailListItemExpansionUnmount}
                    conversationId={mailListItemDataProps.rowId}
                    tableViewId={mailListTableProps.tableViewId}
                    isSingleLine={isSingleLine}
                    tableViewSupportsFlagging={mailListTableProps.supportsFlagging}
                    styleSelectorAsPerUserSettings={props.styleSelectorAsPerUserSettings}
                    isFocusInMailList={props.isFocusInMailList}
                    isFirstLevelExpansion={isFirstLevelExpansion}
                    bigHoverAction={bigHoverAction}
                />
            )}
        </div>
    );
});

const ItemClassIconAriaLabelLookup = {
    [PropertyIcons.MailListViewAppointmentItem]: meeting,
    [PropertyIcons.MailListViewAppointmentAccepted]: meetingAccepted,
    [PropertyIcons.MailListViewAppointmentDeclined]: meetingDeclined,
    [PropertyIcons.MailListViewAppointmentTentative]: meetingTentative,
    [PropertyIcons.MailListViewAppointmentCanceled]: meetingCanceled,
};

function shouldShowBigHoverAction(action: string, canDelete: boolean) {
    switch (action) {
        case 'Delete':
            return canDelete;
        case 'Archive': // TODO add check for when to showArchive
            return true;
    }
    return null;
}
