import MailListItemPartIconBar from './MailListItemPartIconBar';
import getFirstNodeIdToShow from '../selectors/getFirstNodeIdToShow';
import getItemPartTimeText from '../selectors/getItemPartTimeText';
import busStopStateToIconUrlConverter from '../utils/busStopStateToIconUrlConverter';
import { observer } from 'mobx-react-lite';
import { Check } from '@fluentui/react/lib/Check';
import Draggable from 'owa-dnd/lib/components/Draggable';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import loc from 'owa-localize';
import { draftSenderPersonaPlaceholder } from 'owa-locstrings/lib/strings/draftsenderpersonaplaceholder.locstring.json';
import { noSubject } from 'owa-locstrings/lib/strings/nosubject.locstring.json';
import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';
import { getStore as getListViewStore } from 'owa-mail-list-store/lib/store/Store';
import getItemForMailList from 'owa-mail-store/lib/selectors/getItemForMailList';
import getItemIdForMailList from 'owa-mail-store/lib/selectors/getItemIdForMailList';
import type { MailListItemPartDragData } from 'owa-mail-types/lib/types/MailListItemPartDragData';
import { getAnchorForContextMenu } from 'owa-positioning';
import type Message from 'owa-service/lib/contract/Message';
import { getDensityModeString } from 'owa-fabric-theme';
import * as React from 'react';
import {
    getMailListDragPreview,
    MAIL_ITEM_DRAG_XOFFSET,
    MAIL_ITEM_DRAG_YOFFSET,
} from '../utils/mailListDragUtil';
import { MailListItemSelectionSource } from 'owa-mail-store';
import { touchHandler as getTouchHandler, ITouchHandlerParams } from 'owa-touch-handler';
import { useKeydownHandler } from 'owa-hotkeys';
import {
    itemPartCheckboxLabel,
    itemPartBusStopCheck,
    itemPartBusStopUnfilled,
    itemPartBusStopFilled,
    itemPartBusStopNoStop,
} from './MailListItemPart.locstring.json';
import { isFeatureEnabled } from 'owa-feature-flags';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import { getItemClientId } from 'owa-mail-list-table-operations/lib/actions/store-factory/mapItemTypeToItemRelation';
import { lazyPreparePopoutDataForReadingPane } from 'owa-mail-folder-common';
import getCleanPreview from '../utils/getCleanPreview';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import BusStopState from 'owa-mail-list-store/lib/store/schema/BusStopState';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { popoutReadingPane } from 'owa-popout';
import { IconButton } from '@fluentui/react/lib/Button';
import { getClickHandler } from '../utils/getClickHandler';
import { getListViewColumnWidths } from 'owa-mail-layout';
import { getMessageListTextStyle } from '../utils/getMessageListTextStyle';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import shouldTableShowCirclePersonas from '../utils/shouldTableShowCirclePersonas';
import PersonaControl from 'owa-persona/lib/components/PersonaControl';
import { getPersonaSize } from '../utils/getPersonaSize';
import { isMeetingType } from 'owa-mail-list-actions/lib/utils/conversationProperty/getItemClassIcon';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { getBigHoverActionButtonColors } from '../utils/getBigHoverActionButtonColors';

import styles from './MailListItemPart.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListItemPartProps {
    allNodeIds: string[];
    nodeId: string;
    tableViewId: string;
    isSingleLine: boolean;
    tableViewSupportsFlagging: boolean;
    styleSelectorAsPerUserSettings: string;
    isFocusInMailList: () => boolean;
    setSize: number;
    positionInSet: number;
    isFirstLevelExpansion?: boolean;
    bigHoverAction: string;
}

export default observer(function MailListItemPart(props: MailListItemPartProps) {
    const item: Message = getItemForMailList(props.nodeId, props.isFirstLevelExpansion);
    const itemPartRef = React.useRef<HTMLDivElement>();
    const userConfiguration = getUserConfiguration();
    const { isSingleLine, styleSelectorAsPerUserSettings } = props;
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const densityModeString = getDensityModeString();
    const timestampStyles =
        hasDensityNext &&
        classNames(
            getMessageListTextStyle('Minor', densityModeString),
            item?.IsRead === false && styles.timestampUnreadNext
        );

    const isNativeHostMeeting =
        isHostAppFeatureEnabled('useNativeConversationOptions') &&
        item &&
        isMeetingType(item.ItemClass);
    const showPreviewText =
        userConfiguration.UserOptions.ShowPreviewTextInListView &&
        !(isNativeHostMeeting && !item?.Preview);

    const previewText = showPreviewText && item ? getCleanPreview(item.Preview) : null;

    const hasHighTwisty = isFeatureEnabled('mon-tri-mailItemTwisty');

    const showBusStop = useComputedValue(() => {
        const { selectedNodeIds } = getListViewStore().expandedConversationViewState;

        // Show bus stop state when expanded conversation has single selection
        return selectedNodeIds.length === 1;
    }, []);

    const getUniqueSenders = useComputedValue(() => {
        if (props.isFirstLevelExpansion) {
            const forks = getListViewStore().expandedConversationViewState.forks;
            for (const fork of forks) {
                if (fork.id == props.nodeId) {
                    let displayNamesString = '';
                    fork.displayNames?.forEach(
                        sender =>
                            (displayNamesString = displayNamesString.concat(sender).concat('; '))
                    );
                    if (displayNamesString.length > 2) {
                        // remove the semicolon and space in the end
                        displayNamesString = displayNamesString.slice(0, -2);
                    }
                    return displayNamesString;
                }
            }
        }
        return null;
    }, [props.nodeId, props.isFirstLevelExpansion]);

    const renderThreeColumnPreviewText = (previewText: string, hasDensityNext: boolean) => {
        return (
            <div
                className={classNames(
                    styles.previewText,
                    hasDensityNext && getMessageListTextStyle('Major', densityModeString)
                )}>
                {previewText}
            </div>
        );
    };

    const showCheckbox = useComputedValue(() => {
        const { selectedNodeIds } = getListViewStore().expandedConversationViewState;

        // Show checkbox if the current item part is not single selected in expanded conversation
        return (
            !(selectedNodeIds.length === 1 && selectedNodeIds[0] === props.nodeId) || hasHighTwisty
        );
    }, [props.nodeId]);

    const isChecked = useComputedValue(() => {
        const { selectedNodeIds } = getListViewStore().expandedConversationViewState;

        return (
            selectedNodeIds.length > (hasHighTwisty ? 0 : 1) &&
            selectedNodeIds.indexOf(props.nodeId) > -1
        );
    }, [props.nodeId]);

    const isSelected = useComputedValue(() => {
        const { selectedNodeIds } = getListViewStore().expandedConversationViewState;

        return selectedNodeIds.length > 0 && selectedNodeIds.indexOf(props.nodeId) > -1;
    }, [props.nodeId]);

    const showHoverActions = useComputedValue(() => {
        const tableView = getListViewStore().tableViews.get(props.tableViewId);
        if (!tableView) {
            return false;
        }

        const expandedConversationViewState = getListViewStore().expandedConversationViewState;

        // Show hover actions if
        // - the list view is not in multi-select mode
        // - and the list view is not in virual selected all mode
        // - and the expanded list view is not in multi-select mode
        return (
            tableView.selectedRowKeys.size <= 1 &&
            !tableView.isInVirtualSelectAllMode &&
            expandedConversationViewState.selectedNodeIds.length <= 1
        );
    }, [props.tableViewId]);

    const bigHoverAction = props.bigHoverAction;

    const hasHoverDelete =
        ((isFeatureEnabled('mon-tri-mailListItemHoverDelete') && !isSingleLine) ||
            (isFeatureEnabled('mon-tri-mailListItemHoverDeleteSlv') && isSingleLine)) &&
        bigHoverAction === 'Delete';

    const shouldItemBeFocused = useComputedValue(() => {
        const tableView = getListViewStore().tableViews.get(props.tableViewId);

        if (!tableView) {
            return false;
        }

        return getListViewStore().expandedConversationViewState.focusedNodeId === props.nodeId;
    }, [props.nodeId, props.tableViewId]);

    // Determine whether or not to show top border on item part
    const shouldHideTopBorder = useComputedValue(() => {
        const expandedConversationViewState = getListViewStore().expandedConversationViewState;
        const allNodeIds = expandedConversationViewState.allNodeIds;

        const isFirstItemPart =
            props.nodeId == getFirstNodeIdToShow(props.allNodeIds, props.isFirstLevelExpansion);
        const focusedNodeIdIndex = allNodeIds.indexOf(expandedConversationViewState.focusedNodeId);
        const isBelowFocusedItemPart =
            focusedNodeIdIndex !== allNodeIds.length - 1 &&
            allNodeIds[focusedNodeIdIndex + 1] === props.nodeId;
        return isFirstItemPart || isBelowFocusedItemPart;
    }, [props.nodeId, props.allNodeIds, props.isFirstLevelExpansion]);

    /**
     * The onContextMenu event handler which opens the context menu
     * @param evt the mouse event
     */
    const onItemPartContextMenu = React.useCallback(
        (evt: React.MouseEvent<HTMLElement> | KeyboardEvent) => {
            evt.stopPropagation();
            evt.preventDefault();

            const contextMenuAnchor = getAnchorForContextMenu(evt);

            mailListSelectionActionsV2.onItemPartContextMenu(
                contextMenuAnchor,
                props.nodeId,
                props.tableViewId
            );
        },
        [props.nodeId, props.tableViewId]
    );
    useKeydownHandler(itemPartRef, 'shift+f10', onItemPartContextMenu);

    const touchHandler = React.useMemo(() => {
        const touchHandlerParams: ITouchHandlerParams = {
            onLongPress: onItemPartContextMenu,
            onClick: evt => {
                // Rather than directly calling the onClick handler, call click
                // on the ref div to also dismiss any context menus
                itemPartRef.current.click();
            },
        };
        return getTouchHandler(touchHandlerParams);
    }, [onItemPartContextMenu]);

    const onCheckBoxClick = React.useCallback(
        evt => {
            evt.stopPropagation();
            evt.preventDefault();
            // Do not allow the last selected node to be toggled off
            const selectedNodeIds = getListViewStore().expandedConversationViewState
                .selectedNodeIds;
            if (!(selectedNodeIds.length === 1 && selectedNodeIds[0] === props.nodeId)) {
                mailListSelectionActionsV2.toggleSelectItemPart(props.nodeId);
            }
        },
        [props.nodeId]
    );

    const firstColumnTouchHandler = React.useMemo(() => {
        return getTouchHandler({
            onClick: onCheckBoxClick,
        });
    }, [onCheckBoxClick]);

    const clickItemPart = React.useCallback(
        evt => {
            evt.stopPropagation();
            const itemId = getItemIdForMailList(props.nodeId, props.isFirstLevelExpansion);
            mailListSelectionActionsV2.itemPartSelected(
                props.nodeId,
                itemId,
                props.allNodeIds,
                getListViewStore().tableViews.get(props.tableViewId),
                MailListItemSelectionSource.MailListItemExpansion
            );
        },
        [props.nodeId, props.allNodeIds, props.tableViewId, props.isFirstLevelExpansion]
    );

    const trySetFocus = React.useCallback(() => {
        if (shouldItemBeFocused && itemPartRef.current && props.isFocusInMailList()) {
            // Focus on self if ref exists and the item part is focused and focus is in mail list already
            // We need state checks here because this is being called async on requestAnimationFrame.
            itemPartRef.current.focus();
        }
    }, [shouldItemBeFocused, props.isFocusInMailList]);

    const updateFocusOnFocusChange = React.useCallback(() => {
        if (shouldItemBeFocused) {
            window.requestAnimationFrame(trySetFocus);
        }
    }, [shouldItemBeFocused, trySetFocus]);

    // In checked mode we have the parent container be draggable
    const canDrag = React.useCallback(() => {
        return (
            getListViewStore().expandedConversationViewState.selectedNodeIds.indexOf(
                props.nodeId
            ) == -1
        );
    }, [props.nodeId]);

    const getDragData = React.useCallback((): MailListItemPartDragData => {
        const item: Message = getItemForMailList(props.nodeId, props.isFirstLevelExpansion);
        return {
            itemType: DraggableItemTypes.MailListItemPart,
            tableViewId: props.tableViewId,
            subjects: [item.Subject ? item.Subject : loc(noSubject)],
            itemIds: [item.ItemId.Id],
            nodeIds: [props.nodeId],
            sizes: [item.Size],
        };
    }, [props.nodeId, props.tableViewId]);

    const onDoubleClick = React.useCallback(
        evt => {
            evt.stopPropagation();
            const { selectedNodeIds } = getListViewStore().expandedConversationViewState;
            if (selectedNodeIds.length == 1) {
                const item: Message = getItemForMailList(
                    selectedNodeIds[0],
                    props.isFirstLevelExpansion
                );
                const tableView = getListViewStore().tableViews.get(props.tableViewId);
                const clientItemId = getItemClientId(item.ItemId.Id, tableView);

                popoutReadingPane(clientItemId.Id, null, clientItemId.mailboxInfo, async () => {
                    const preparePopoutDataForReadingPane = await lazyPreparePopoutDataForReadingPane.import();
                    return preparePopoutDataForReadingPane(tableView);
                });
            }
        },
        [props.isFirstLevelExpansion, props.tableViewId]
    );

    const renderBusStopCheckBox = () => {
        const checkBoxClassNames = classNames(
            densityModeString,
            styles.itemPartCheckboxContainer,
            (isChecked || hasHighTwisty) && styles.showCheckbox
        );
        const busStopStateMap = getListViewStore().expandedConversationViewState.busStopStateMap;
        const busStopStateForNode = busStopStateMap.get(props.nodeId);
        const busStopAltText = getBusStopAltText(busStopStateForNode);
        const source = busStopStateToIconUrlConverter(busStopStateForNode, isSingleLine);
        const checkBoxAriaProps: AriaProperties = {
            role: AriaRoles.checkbox,
            checked: isChecked,
            label: loc(itemPartCheckboxLabel),
        };

        return (
            <>
                {showBusStop && source && !hasHighTwisty && (
                    <img
                        className={classNames(
                            densityModeString,
                            styleSelectorAsPerUserSettings,
                            styles.busStopContainer,
                            showPreviewText && !isSingleLine && styles.busStopThreeColumnPreview,
                            hasDensityNext && styles.busStopHeight
                        )}
                        src={source}
                        alt={busStopAltText}
                        role="presentation"
                        {...firstColumnTouchHandler}
                    />
                )}
                {showCheckbox && (
                    <div
                        className={classNames(
                            showPreviewText && styles.busStopThreeColumnPreview,
                            styleSelectorAsPerUserSettings,
                            hasDensityNext && styles.checkboxFirstColumn
                        )}
                        {...firstColumnTouchHandler}
                        onClick={onCheckBoxClick}
                        {...generateDomPropertiesForAria(checkBoxAriaProps)}>
                        <Check className={checkBoxClassNames} checked={isChecked} />
                    </div>
                )}
            </>
        );
    };

    const renderPersonaCheckbox = () => {
        const checkBoxAriaProps: AriaProperties = {
            role: AriaRoles.checkbox,
            checked: isChecked,
            label: loc(itemPartCheckboxLabel),
        };
        const senderMailbox = item.From?.Mailbox;
        const tableView = getListViewStore().tableViews.get(props.tableViewId);
        const showCirclePersonas = shouldTableShowCirclePersonas(tableView.tableQuery);
        return (
            <div
                className={styleSelectorAsPerUserSettings}
                tabIndex={-1}
                {...firstColumnTouchHandler}>
                {!isSelected && showCirclePersonas && senderMailbox && (
                    <PersonaControl
                        name={senderMailbox.Name}
                        emailAddress={senderMailbox.EmailAddress}
                        size={getPersonaSize(hasDensityNext, isSingleLine, densityModeString)}
                        className={styles.personaItemPart}
                        mailboxType={senderMailbox.MailboxType}
                    />
                )}
                <div onClick={onCheckBoxClick} {...generateDomPropertiesForAria(checkBoxAriaProps)}>
                    <Check checked={isChecked} className={!isSelected && styles.checkboxItemPart} />
                </div>
            </div>
        );
    };

    const renderFirstColumnContent = () => {
        return shouldShowUnstackedReadingPane() ? renderPersonaCheckbox() : renderBusStopCheckBox();
    };

    const renderThirdColumn = (item: Message, hasBigHoverAction: boolean) => {
        const usingHeaders = isFeatureEnabled('mon-tri-columnHeadersSlv');
        const { receivedColumnWidth } = getListViewColumnWidths(
            getListViewStore().tableViews.get(props.tableViewId)
        );

        const thirdColumnWidth = usingHeaders
            ? {
                  width: receivedColumnWidth,
                  maxWidth: receivedColumnWidth,
              }
            : {};

        const densityModeString = getDensityModeString();
        const timeText = getItemPartTimeText(item);
        return (
            <div
                className={classNames(
                    styles.mailListItemPartThirdColumnSingleLineView,
                    borderColor,
                    shouldHideTopBorder && styles.itemPartNoTopBorder,
                    styles.slvBigHoverThirdColumn,
                    usingHeaders && styles.thirdColumnWithColumnHeadersNoRightPadding
                )}
                style={thirdColumnWidth}>
                <span
                    className={classNames(
                        usingHeaders ? styles.itemPartTimeWithHeaders : styles.itemPartTime,
                        usingHeaders && densityModeString,
                        hasDensityNext && getMessageListTextStyle('Minor', densityModeString)
                    )}>
                    {timeText}
                </span>
                {hasBigHoverAction && (
                    <div className={styles.thirdColumnIconBarWithHeaders}>
                        <MailListItemPartIconBar
                            containerClassName={classNames(
                                styleSelectorAsPerUserSettings,
                                hasBigHoverAction && styles.bigHoverAction
                            )}
                            neverShowPropertyIcons={true}
                            {...props}
                        />
                    </div>
                )}
            </div>
        );
    };

    const getWidthToRemoveFromFirstColumn = () => {
        if (densityModeString === 'full') {
            if (props.styleSelectorAsPerUserSettings === 'SLVConversationViewSenderImageOn') {
                return 68;
            }
            return 56;
        }

        return 54;
    };

    const renderSingleLineViewMailListItemPart = (borderColor: string) => {
        const item: Message = getItemForMailList(props.nodeId, props.isFirstLevelExpansion);
        const senderName = getUniqueSenders || item.From?.Mailbox?.Name;
        const senderClasses = classNames(
            !item.IsRead ? styles.senderUnread : styles.sender,
            item.IsDraft && styles.draft,
            hasDensityNext &&
                getMessageListTextStyle('Major', densityModeString, true /*isFirstLine */)
        );

        const usingHeaders = isFeatureEnabled('mon-tri-columnHeadersSlv');
        const hasBigHoverAction = isFeatureEnabled('mon-tri-mailListItemHoverDeleteSlv');

        const { senderColumnWidth, subjectColumnWidth } = getListViewColumnWidths(
            getListViewStore().tableViews.get(props.tableViewId)
        );

        // 8px to account for extra padding on item parts in unstacked view. Keep in sync with styles.itemPartUnstacked
        const widthToRemoveFromFirstColumn =
            getWidthToRemoveFromFirstColumn() - (shouldShowUnstackedReadingPane() && 8);
        const firstColumnWidth = usingHeaders
            ? {
                  width: senderColumnWidth - widthToRemoveFromFirstColumn,
                  maxWidth: senderColumnWidth - widthToRemoveFromFirstColumn,
                  paddingRight: '0px',
                  marginRight: '4px',
              }
            : {};

        const secondColumnWidth = usingHeaders
            ? {
                  width: subjectColumnWidth,
                  maxWidth: subjectColumnWidth,
                  paddingLeft: '16px',
              }
            : {};

        return (
            <>
                <div
                    className={classNames(
                        styleSelectorAsPerUserSettings,
                        styles.mailListItemPartFirstColumnSingleLineView,
                        densityModeString,
                        showPreviewText && styles.slvPreviewFirstColumn,
                        shouldShowUnstackedReadingPane() && styles.itemPartUnstacked
                    )}>
                    {renderFirstColumnContent()}
                </div>
                <div
                    style={firstColumnWidth}
                    className={classNames(
                        styleSelectorAsPerUserSettings,
                        showPreviewText && styles.slvPreviewSecondColumn,
                        styles.mailListItemPartSecondColumnSingleLineView,
                        borderColor,
                        shouldHideTopBorder && styles.itemPartNoTopBorder
                    )}>
                    <span className={senderClasses}>
                        {item.IsDraft ? loc(draftSenderPersonaPlaceholder) : senderName}
                    </span>
                    <MailListItemPartIconBar
                        containerClassName={classNames(
                            styles.slvSenderRow,
                            styleSelectorAsPerUserSettings
                        )}
                        neverShowHoverIcons={hasBigHoverAction}
                        {...props}
                    />
                </div>
                <div
                    className={classNames(
                        styles.mailListItemPartThirdColumnSingleLineView,
                        usingHeaders &&
                            showPreviewText &&
                            styles.mailListItemPartThirdColumnSingleLineViewWithColumnHeaders,
                        borderColor,
                        shouldHideTopBorder && styles.itemPartNoTopBorder,
                        showPreviewText && styles.slvPreviewTextContainer,
                        usingHeaders && styles.columnHeaderAdjustments
                    )}
                    style={secondColumnWidth}>
                    {showPreviewText && (
                        <div
                            className={classNames(
                                usingHeaders
                                    ? styles.previewTextWithColumnHeaders
                                    : styles.previewText,
                                hasDensityNext &&
                                    getMessageListTextStyle('Major', densityModeString)
                            )}>
                            {previewText}
                        </div>
                    )}
                    {!usingHeaders && renderThirdColumn(item, hasBigHoverAction)}
                </div>
                {usingHeaders && renderThirdColumn(item, hasBigHoverAction)}
            </>
        );
    };

    const renderThreeColumnViewMailListItemPart = (borderColor: string) => {
        const senderName = getUniqueSenders || item.From?.Mailbox?.Name;
        const timeText = getItemPartTimeText(item);
        const senderClasses = classNames(
            hasDensityNext && getMessageListTextStyle('Major', densityModeString),
            !item.IsRead ? styles.senderUnread : styles.sender,
            item.IsDraft && styles.draft,
            shouldShowUnstackedReadingPane() && styles.threeColumnItemPartWidth
        );

        return showPreviewText ? (
            <div
                className={classNames(
                    !hasDensityNext && styles.threeColumnViewContainer,
                    hasDensityNext && styles.threeColumnViewContainerNext,
                    hasDensityNext && getDensityModeString()
                )}>
                <div
                    className={classNames(
                        styleSelectorAsPerUserSettings,
                        styles.mailListItemPartFirstColumnThreeColumnView,
                        densityModeString,
                        hasHighTwisty && styles.highTwistyWithPreview,
                        shouldShowUnstackedReadingPane() && styles.itemPartUnstacked
                    )}>
                    {renderFirstColumnContent()}
                </div>
                <div className={styles.column}>
                    <div
                        className={classNames(
                            shouldHideTopBorder && styles.itemPartNoTopBorder,
                            hasDensityNext && styles.firstRowThreeColumnNext,
                            !hasDensityNext && styles.firstRowThreeColumn,
                            styles.firstRowThreeColumnPreview
                        )}>
                        <span className={classNames(senderClasses)}>
                            {item.IsDraft ? loc(draftSenderPersonaPlaceholder) : senderName}
                        </span>
                        <MailListItemPartIconBar {...props} />
                    </div>
                    <div
                        className={classNames(
                            shouldHideTopBorder && styles.itemPartNoTopBorder,
                            styles.secondRowThreeColumn,
                            hasDensityNext && styles.secondRowThreeColumnPaddingNext,
                            shouldShowUnstackedReadingPane() && styles.threeColumnItemPartWidth
                        )}>
                        {renderThreeColumnPreviewText(previewText, hasDensityNext)}
                        {!props.isFirstLevelExpansion && (
                            <span
                                className={classNames(
                                    styles.itemPartTime,
                                    styles.previewTime,
                                    timestampStyles
                                )}>
                                {timeText}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <>
                <div
                    className={classNames(
                        styleSelectorAsPerUserSettings,
                        styles.mailListItemPartFirstColumnThreeColumnView,
                        densityModeString,
                        hasHighTwisty && styles.highTwisty
                    )}>
                    {renderFirstColumnContent()}
                </div>
                <div
                    className={classNames(
                        styles.mailListItemPartSecondColumnThreeColumnView,
                        borderColor,
                        shouldHideTopBorder && styles.itemPartNoTopBorder
                    )}>
                    <span className={senderClasses}>
                        {item.IsDraft ? loc(draftSenderPersonaPlaceholder) : senderName}
                    </span>
                </div>
                <div
                    className={classNames(
                        isNativeHostMeeting
                            ? styles.mailListItemPartMeetingThirdColumnThreeColumnView
                            : styles.mailListItemPartMessageThirdColumnThreeColumnView,
                        borderColor,
                        shouldHideTopBorder && styles.itemPartNoTopBorder
                    )}>
                    {!props.isFirstLevelExpansion && !isNativeHostMeeting && (
                        <span className={styles.itemPartTime}>{timeText}</span>
                    )}
                    <MailListItemPartIconBar {...props} />
                </div>
            </>
        );
    };

    const shouldBackgroundChangeOnHover = !isSelected && !isChecked && !hasHoverDelete;
    let itemPartClasses;

    if (shouldItemBeFocused) {
        updateFocusOnFocusChange();
    }

    let unreadStyle = styles.unread;
    let hoverStyle = styles.showHoverStyles;
    let borderColor = styles.itemPartBorderColor;
    if (item) {
        itemPartClasses = classNames(
            hasHoverDelete && (isSingleLine ? styles.showDeleteOnHover : styles.hoverDelete),
            showPreviewText && !isSingleLine && styles.threeColumnPreviewContainer,
            densityModeString,
            styles.itemPart,
            hasDensityNext && isSingleLine && styles.itemPartSLV,
            calculateBackgroundColorClass(props, isSelected),
            !item.IsRead && unreadStyle,
            showHoverActions && styles.showItemPartHoverActionsOnHover,
            shouldBackgroundChangeOnHover && hoverStyle,
            item.IsDraft && styles.itemPartContentDraft
        );
    }

    const itemAriaProps: AriaProperties = {
        role: AriaRoles.treeitem,
        setSize: props.setSize,
        positionInSet: props.positionInSet,
    };

    const bigHoverOnClick = (event: React.MouseEvent<unknown>) => {
        getClickHandler(bigHoverAction, true)(props.tableViewId, props.nodeId, 'Hover');
    };

    return (
        item && (
            <Draggable
                canDrag={canDrag}
                getDragData={getDragData}
                getDragPreview={getMailListDragPreview}
                xOffset={MAIL_ITEM_DRAG_XOFFSET}
                yOffset={MAIL_ITEM_DRAG_YOFFSET}
                ariaProps={itemAriaProps}>
                <div
                    {...touchHandler}
                    ref={itemPartRef}
                    tabIndex={-1}
                    data-is-focusable={true}
                    key={item.ItemId.Id}
                    className={itemPartClasses}
                    onClick={clickItemPart}
                    onDoubleClick={onDoubleClick}
                    onContextMenu={onItemPartContextMenu}>
                    {isSingleLine
                        ? renderSingleLineViewMailListItemPart(borderColor)
                        : renderThreeColumnViewMailListItemPart(borderColor)}
                    {hasHoverDelete && (
                        <IconButton
                            iconProps={{ iconName: bigHoverAction }}
                            className={classNames(
                                styles.showBigActionButton,
                                getBigHoverActionButtonColors(styles, bigHoverAction),
                                isSingleLine && styles.slvBigHover
                            )}
                            onClick={bigHoverOnClick}
                        />
                    )}
                </div>
            </Draggable>
        )
    );
});

/**
 * Calculates and returns the background color css for this mail list item part
 */
function calculateBackgroundColorClass(
    { nodeId, isFirstLevelExpansion }: MailListItemPartProps,
    isSelected: boolean
): string {
    const item: Message = getItemForMailList(nodeId, isFirstLevelExpansion);

    if (isSelected) {
        return styles.selectedItemPartColor;
    } else if (item?.Flag && item.Flag.FlagStatus == 'Flagged') {
        return styles.flaggedMailListItemPartColor;
    } else {
        return null;
    }
}

function getBusStopAltText(busStopState: BusStopState) {
    switch (busStopState) {
        case BusStopState.BusStart || BusStopState.CheckMark:
            return loc(itemPartBusStopCheck);

        case BusStopState.BusStop:
            return loc(itemPartBusStopUnfilled);

        case BusStopState.NoStop:
            return loc(itemPartBusStopNoStop);

        case BusStopState.BusEnd:
            return loc(itemPartBusStopFilled);

        default:
            return '';
    }
}
